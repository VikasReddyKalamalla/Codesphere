const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const WorkspaceFile = require('../models/WorkspaceFile');
const WorkspaceChat = require('../models/WorkspaceChat');
const WorkspaceMember = require('../models/WorkspaceMember');
const WorkspaceActivity = require('../models/WorkspaceActivity');
const socketService = require('../services/socket.service');
const presenceService = require('../services/presence.service');
const activityService = require('../services/workspaceActivity.service');

// Maps socket.id -> Map(tabId -> childProcess)
const activeTerminals = new Map();

const handleCodex = (socket, io) => {
  const user = socket.user;

  // ─── JOIN WORKSPACE ────────────────────────────────────────────────────────
  socket.on('join_workspace', async ({ workspaceId }) => {
    try {
      const roomKey = `workspace:${workspaceId}`;
      socket.join(roomKey);
      
      await socketService.getOrCreateRoom({
        roomKey,
        type: 'workspace',
        referenceId: workspaceId,
        referenceModel: 'Workspace',
        createdBy: user._id,
      });

      await socketService.addUserToRoom(roomKey, user._id);
      await presenceService.updateContext(user._id, {
        currentRoom: roomKey,
        currentWorkspace: workspaceId,
      });

      // Fetch chat history
      const chats = await WorkspaceChat.find({ workspaceId })
        .populate('sender', 'fullName username avatar')
        .sort({ createdAt: -1 })
        .limit(40)
        .lean();
      
      // Fetch online members in this room
      const activeUsers = await socketService.getRoomUsers(roomKey);

      // Welcome the joining user
      socket.emit('workspace_joined', {
        roomKey,
        activeUsers,
        chatHistory: chats.reverse(),
      });

      // Notify others in the workspace
      socket.to(roomKey).emit('member_joined', {
        user: {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          avatar: user.avatar,
        },
      });

      // Log join activity
      await activityService.log(workspaceId, user._id, 'member_joined', `${user.fullName} joined the collaborative coding session`);
      io.to(roomKey).emit('activity_added', {
        activity: {
          userId: { _id: user._id, fullName: user.fullName, avatar: user.avatar },
          activityType: 'member_joined',
          description: `${user.fullName} joined the collaborative coding session`,
          createdAt: new Date(),
        }
      });

    } catch (err) {
      socket.emit('workspace_error', { message: err.message });
    }
  });

  // ─── LEAVE WORKSPACE ───────────────────────────────────────────────────────
  socket.on('leave_workspace', async ({ workspaceId }) => {
    const roomKey = `workspace:${workspaceId}`;
    socket.leave(roomKey);
    await socketService.removeUserFromRoom(roomKey, user._id);

    socket.to(roomKey).emit('member_left', { userId: user._id, fullName: user.fullName });

    // Clean up terminals
    const userTerms = activeTerminals.get(socket.id);
    if (userTerms) {
      for (const term of userTerms.values()) {
        term.kill();
      }
      activeTerminals.delete(socket.id);
    }

    // Log leave activity
    await activityService.log(workspaceId, user._id, 'member_left', `${user.fullName} left the collaborative session`);
  });

  // ─── CODE CHANGE ───────────────────────────────────────────────────────────
  socket.on('code_change', ({ workspaceId, filePath, content }) => {
    const roomKey = `workspace:${workspaceId}`;
    socket.to(roomKey).emit('code_change', {
      filePath,
      content,
      senderId: user._id,
      senderName: user.fullName
    });
  });

  // ─── CURSOR MOVE ───────────────────────────────────────────────────────────
  socket.on('cursor_move', ({ workspaceId, filePath, cursor }) => {
    const roomKey = `workspace:${workspaceId}`;
    socket.to(roomKey).emit('cursor_move', {
      filePath,
      cursor, // { row, col }
      userId: user._id,
      fullName: user.fullName,
      avatar: user.avatar
    });
  });

  // ─── FILE OPEN ─────────────────────────────────────────────────────────────
  socket.on('file_open', ({ workspaceId, filePath }) => {
    const roomKey = `workspace:${workspaceId}`;
    socket.to(roomKey).emit('file_open', {
      filePath,
      userId: user._id,
      fullName: user.fullName
    });
  });

  // ─── FILE SAVE ─────────────────────────────────────────────────────────────
  socket.on('file_save', async ({ workspaceId, filePath, content }) => {
    const roomKey = `workspace:${workspaceId}`;
    try {
      // 1. Sync in database
      await WorkspaceFile.findOneAndUpdate(
        { workspaceId, path: filePath },
        { content },
        { new: true }
      );

      // 2. Sync to disk physical directory
      const diskRoot = path.join(__dirname, '../uploads/workspaces', workspaceId.toString());
      const absolutePath = path.join(diskRoot, filePath);
      
      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
      fs.writeFileSync(absolutePath, content, 'utf8');

      // 3. Emit sync events to room
      io.to(roomKey).emit('file_save', { filePath, content, senderId: user._id });
      io.to(roomKey).emit('preview_update', { filePath });

      // Log activity
      await activityService.log(workspaceId, user._id, 'code_edited', `${user.fullName} edited and saved file "${filePath}"`);
      io.to(roomKey).emit('activity_added', {
        activity: {
          userId: { _id: user._id, fullName: user.fullName, avatar: user.avatar },
          activityType: 'code_edited',
          description: `${user.fullName} edited and saved file "${filePath}"`,
          createdAt: new Date(),
        }
      });
    } catch (err) {
      socket.emit('workspace_error', { message: `File save error: ${err.message}` });
    }
  });

  // ─── INTERACTIVE INTEGRATED TERMINAL ───────────────────────────────────────
  socket.on('terminal_input', ({ workspaceId, tabId, input }) => {
    try {
      let userTerms = activeTerminals.get(socket.id);
      if (!userTerms) {
        userTerms = new Map();
        activeTerminals.set(socket.id, userTerms);
      }

      let term = userTerms.get(tabId);
      if (!term) {
        // Spawn active shell in workspace subfolder
        const diskRoot = path.join(__dirname, '../uploads/workspaces', workspaceId.toString());
        if (!fs.existsSync(diskRoot)) {
          fs.mkdirSync(diskRoot, { recursive: true });
        }

        const shell = process.platform === 'win32' ? 'cmd.exe' : 'bash';
        
        term = spawn(shell, [], {
          cwd: diskRoot,
          env: {
            ...process.env,
            CWD: diskRoot,
            PATH: process.env.PATH
          }
        });

        // Pipe outputs
        term.stdout.on('data', (data) => {
          socket.emit('terminal_output', { tabId, text: data.toString() });
        });
        term.stderr.on('data', (data) => {
          socket.emit('terminal_output', { tabId, text: data.toString() });
        });

        term.on('close', (code) => {
          socket.emit('terminal_output', { tabId, text: `\r\nShell process exited with code ${code}\r\n` });
          userTerms.delete(tabId);
        });

        userTerms.set(tabId, term);
      }

      // Write user input directly to shell input stream
      if (term.stdin) {
        term.stdin.write(input);
      }
    } catch (err) {
      socket.emit('terminal_output', { tabId, text: `\r\nError launching terminal: ${err.message}\r\n` });
    }
  });

  socket.on('terminal_close', ({ tabId }) => {
    const userTerms = activeTerminals.get(socket.id);
    if (userTerms) {
      const term = userTerms.get(tabId);
      if (term) {
        term.kill();
        userTerms.delete(tabId);
      }
    }
  });

  // ─── CHAT MESSAGES ─────────────────────────────────────────────────────────
  socket.on('chat_message', async ({ workspaceId, content, type = 'text', fileUrl = '', fileName = '' }) => {
    try {
      const roomKey = `workspace:${workspaceId}`;
      const message = await WorkspaceChat.create({
        workspaceId,
        sender: user._id,
        content: content.trim(),
        type,
        fileUrl,
        fileName
      });

      const populated = await message.populate('sender', 'fullName username avatar');
      io.to(roomKey).emit('chat_message', { message: populated });

    } catch (err) {
      socket.emit('workspace_error', { message: err.message });
    }
  });

  // ─── TYPING INDICATORS ─────────────────────────────────────────────────────
  socket.on('typing', ({ workspaceId, isTyping }) => {
    const roomKey = `workspace:${workspaceId}`;
    socket.to(roomKey).emit('typing', {
      userId: user._id,
      fullName: user.fullName,
      isTyping
    });
  });

  // ─── TASK UPDATE PROPAGATIONS ──────────────────────────────────────────────
  socket.on('task_created', ({ workspaceId, task }) => {
    const roomKey = `workspace:${workspaceId}`;
    socket.to(roomKey).emit('task_created', { task });
  });

  socket.on('task_updated', ({ workspaceId, task }) => {
    const roomKey = `workspace:${workspaceId}`;
    socket.to(roomKey).emit('task_updated', { task });
  });

  socket.on('task_completed', ({ workspaceId, task }) => {
    const roomKey = `workspace:${workspaceId}`;
    socket.to(roomKey).emit('task_completed', { task });
  });

  // ─── GENERIC ACTIVITY LOGGING ──────────────────────────────────────────────
  socket.on('activity_added', async ({ workspaceId, activityType, description }) => {
    const roomKey = `workspace:${workspaceId}`;
    await activityService.log(workspaceId, user._id, activityType, description);
    io.to(roomKey).emit('activity_added', {
      activity: {
        userId: { _id: user._id, fullName: user.fullName, avatar: user.avatar },
        activityType,
        description,
        createdAt: new Date(),
      }
    });
  });

  // ─── CLEANUP ON DISCONNECT ─────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const userTerms = activeTerminals.get(socket.id);
    if (userTerms) {
      for (const term of userTerms.values()) {
        term.kill();
      }
      activeTerminals.delete(socket.id);
    }
  });
};

module.exports = { handleCodex };
