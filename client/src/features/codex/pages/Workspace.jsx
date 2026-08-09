import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import { 
  FolderCode, Plus, Play, Save, Settings, Users, Activity, 
  BarChart3, MessageSquare, Terminal, Eye, Link2, GitBranch, 
  GitCommit, Phone, PhoneOff, Mic, MicOff, Video, Monitor, 
  Search, Bell, LogOut, CheckSquare, PlusCircle, Maximize2, Minimize2, 
  RefreshCw, Lock, Sparkles, HelpCircle, ArrowRight, Share2, Award, ShieldAlert,
  Code2, Check, Copy, Trash2, Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';

import { socket } from '../../../socket/socket.js';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';
import { ThemeContext } from '../../../providers/ThemeProvider.jsx';

// Subcomponents
import { WorkspaceFiles } from '../components/WorkspaceFiles.jsx';
import { WorkspaceChat } from '../components/WorkspaceChat.jsx';
import { WorkspaceMembers } from '../components/WorkspaceMembers.jsx';
import { WorkspaceSettings } from '../components/WorkspaceSettings.jsx';
import { ActivityFeed } from '../components/ActivityFeed.jsx';
import { WorkspaceAnalytics } from '../components/WorkspaceAnalytics.jsx';
import { KanbanBoard } from '../components/KanbanBoard.jsx';
import { TaskModal } from '../components/TaskModal.jsx';
import { APITester } from '../components/APITester.jsx';
import { WorkspaceVoiceBar } from '../components/WorkspaceVoiceBar.jsx';
import { SessionManagerModal } from '../../../components/SessionManagerModal.jsx';
import { InviteModal } from '../components/InviteModal.jsx';
import { BackButton } from '@components/common/BackButton.jsx';
import { Button } from '@components/common/Button.jsx';

// Actions
import {
  setCurrentWorkspace, setFiles, addFile, updateFile, deleteFile,
  setActiveFile, updateLocalCode, setTasks, addTask, updateTask,
  deleteTask, setMembers, setChats, addChat, setActivities, addActivity,
  setAnalytics, setOnlineUsers, addOnlineUser, removeOnlineUser,
  setCursor, setTyping, setActiveTab, setEditorTheme
} from '../redux/codexSlice.js';

// API services
import {
  fetchWorkspaceDetailsAPI,
  fetchWorkspaceMembersAPI,
  fetchWorkspaceTasksAPI,
  fetchWorkspaceFilesAPI,
  createWorkspaceFileAPI,
  updateWorkspaceFileAPI,
  deleteWorkspaceFileAPI,
  duplicateWorkspaceFileAPI,
  uploadWorkspaceFileAPI,
  fetchWorkspaceChatsAPI,
  searchWorkspaceChatsAPI,
  fetchWorkspaceAnalyticsAPI,
  updateWorkspaceSettingsAPI,
  deleteWorkspaceAPI,
  archiveWorkspaceAPI,
  restoreWorkspaceAPI,
  inviteWorkspaceMemberAPI,
  createWorkspaceTaskAPI,
  updateWorkspaceTaskAPI,
  deleteWorkspaceTaskAPI,
  runUniversalCodeAPI
} from '../services/codexAPI.js';

export const Workspace = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  // Redux collaborative states
  const {
    currentWorkspace,
    files,
    activeFile,
    tasks,
    members,
    chats,
    activities,
    analytics,
    onlineUsers,
    cursors,
    typingUsers,
    activeTab,
    editorTheme
  } = useSelector(state => state.codex);

  // Local component states
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Layout panel states
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('files'); // 'files' | 'info' | 'collaborators'
  const [rightWidgetTab, setRightWidgetTab] = useState('tasks'); // 'tasks' | 'activity'

  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  // Terminal states
  const [terminalTabs, setTerminalTabs] = useState([
    { id: 'term-1', name: 'Terminal', logs: [
      'CodeSphere Interactive Sandbox Terminal v2.4',
      'Environment: Node.js & Shell Compiler Engine',
      'Type any command e.g. "node main.js", "ls", "python3 main.py", or "clear".',
      ''
    ] },
    { id: 'term-2', name: 'Problems (0)', logs: ['No syntax or compilation errors found.'] },
    { id: 'term-3', name: 'Output', logs: ['Sandbox engine active. Hot-reloading ready.'] },
    { id: 'term-4', name: 'Git Logs', logs: ['On branch main. Ready to sync with remote GitHub.'] }
  ]);
  const [activeTermId, setActiveTermId] = useState('term-1');
  const [termInputText, setTermInputText] = useState('');
  const [terminalFullscreen, setTerminalFullscreen] = useState(false);

  // Preview states
  const [previewDevice, setPreviewDevice] = useState('desktop'); 
  const [previewCacheBuster, setPreviewCacheBuster] = useState(Date.now());
  const [previewTab, setPreviewTab] = useState('preview'); 

  // Voice states
  const [inVoiceCall, setInVoiceCall] = useState(false);
  const [micMuted, setMicMuted] = useState(false);

  // GitHub states
  const [gitBranch, setGitBranch] = useState('main');
  const [gitHistory, setGitHistory] = useState([
    { commit: 'a1b2c3d', author: 'Rohan Mehta', message: 'feat: add product filtering' },
    { commit: 'b2c3d4e', author: 'Priya Sharma', message: 'fix: cart total calculation' },
    { commit: 'c3d4e5f', author: 'Neha Gupta', message: 'style: improve product card UI' }
  ]);

  // Search/Filters states
  const [globalSearch, setGlobalSearch] = useState('');

  // Session Manager Modal states
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionModalMode, setSessionModalMode]     = useState('start'); // 'start' | 'end'
  const [isGitHubImported, setIsGitHubImported]     = useState(false);
  const [activeRepoUrl, setActiveRepoUrl]           = useState('');

  const handleStartSessionFlow = async ({ isGitHub, repoUrl, importData }) => {
    setIsGitHubImported(isGitHub);
    setActiveRepoUrl(repoUrl);
    setIsSessionModalOpen(false);
    if (isGitHub && repoUrl) {
      toast.success(`GitHub Repository "${repoUrl}" connected to workspace!`);
      // Reload workspace files to display imported GitHub files
      try {
        const filesRes = await fetchWorkspaceFilesAPI(workspaceId);
        if (filesRes.success && filesRes.data?.files) {
          dispatch(setFiles(filesRes.data.files));
          if (filesRes.data.files.length > 0) {
            dispatch(setActiveFile(filesRes.data.files[0]));
          }
        }
      } catch (fErr) {
        console.warn('[Workspace] File refresh after GitHub import error:', fErr);
      }
    }
  };

  const handleEndSessionFlow = ({ pushToGit, repoUrl, terminateStorage, commitData }) => {
    setIsSessionModalOpen(false);
    if (pushToGit && repoUrl) {
      toast.success(`Session edits pushed to GitHub repository "${repoUrl}"!`);
      if (commitData) {
        setGitHistory(prev => [
          {
            commit: commitData.commit || 'g8f3a91',
            message: commitData.message || 'Update from CodeSphere Web Studio',
            author: currentUser?.fullName || 'You',
            date: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      }
    }
    if (terminateStorage) {
      toast.success('Workspace session terminated cleanly.');
      navigate('/codex');
    }
  };

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorRef = useRef([]);
  const terminalLogsRef = useRef(null);

  // Auto-scroll terminal container when new logs arrive
  useEffect(() => {
    if (terminalLogsRef.current) {
      terminalLogsRef.current.scrollTop = terminalLogsRef.current.scrollHeight;
    }
  }, [terminalTabs, activeTermId]);



  // Warn user before closing tab or navigating away to push code to GitHub
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const msg = 'You have active workspace edits! Make sure to push your code to your GitHub repository before closing this tab.';
      e.preventDefault();
      e.returnValue = msg;
      return msg;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Load Initial API Data
  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetchWorkspaceDetailsAPI(workspaceId),
      fetchWorkspaceMembersAPI(workspaceId),
      fetchWorkspaceTasksAPI(workspaceId),
      fetchWorkspaceFilesAPI(workspaceId),
      fetchWorkspaceAnalyticsAPI(workspaceId)
    ])
      .then(([wsRes, memRes, taskRes, fileRes, analyticsRes]) => {
        if (wsRes.status === 'fulfilled' && wsRes.value?.success) {
          dispatch(setCurrentWorkspace(wsRes.value.data));
        } else if (wsRes.status === 'rejected') {
          console.error('Failed to load workspace details:', wsRes.reason);
          toast.error(wsRes.reason?.response?.data?.message || 'Failed to retrieve workspace data');
        }

        if (memRes.status === 'fulfilled' && memRes.value?.success) {
          dispatch(setMembers(memRes.value.data?.members || memRes.value.data || []));
        }
        if (taskRes.status === 'fulfilled' && taskRes.value?.success) {
          dispatch(setTasks(taskRes.value.data?.tasks || taskRes.value.data || []));
        }
        if (fileRes.status === 'fulfilled' && fileRes.value?.success) {
          const list = fileRes.value.data?.files || fileRes.value.data || [];
          dispatch(setFiles(list));
          if (list.length > 0) {
            const defaultFile = list.find(f => f.name === 'index.html') || list[0];
            dispatch(setActiveFile(defaultFile));
          }
        }
        if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.success) {
          dispatch(setAnalytics(analyticsRes.value.data?.stats || analyticsRes.value.data));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [workspaceId, dispatch]);

  // Socket setup
  useEffect(() => {
    const token = localStorage.getItem('codesphere_token');
    socket.auth = { token };
    socket.connect();

    socket.emit('join_workspace', { workspaceId });

    socket.on('workspace_joined', ({ roomKey, activeUsers, chatHistory }) => {
      dispatch(setOnlineUsers(activeUsers));
      dispatch(setChats(chatHistory.map(c => ({
        _id: c._id,
        text: c.content,
        user: c.sender?.fullName || 'Collaborator',
        sender: c.sender,
        createdAt: c.createdAt
      }))));
    });

    socket.on('member_joined', ({ user }) => {
      toast.success(`${user.fullName} joined workspace!`);
      dispatch(addOnlineUser(user));
    });

    socket.on('member_left', ({ userId, fullName }) => {
      toast.error(`${fullName || 'Collaborator'} left workspace`);
      dispatch(removeOnlineUser(userId));
    });

    socket.on('code_change', ({ filePath, content, senderId }) => {
      if (senderId !== currentUser?._id) {
        dispatch(updateLocalCode({ filePath, content }));
      }
    });

    socket.on('cursor_move', ({ filePath, cursor, userId, fullName, avatar }) => {
      if (userId !== currentUser?._id) {
        dispatch(setCursor({ userId, cursor: { row: cursor.row, col: cursor.col, name: fullName, avatar, filePath } }));
      }
    });

    socket.on('file_save', ({ filePath, content, senderId }) => {
      if (senderId !== currentUser?._id) {
        dispatch(updateLocalCode({ filePath, content }));
        toast.success(`File "${filePath}" synchronized!`);
      }
    });

    socket.on('preview_update', () => {
      setPreviewCacheBuster(Date.now());
    });

    socket.on('terminal_output', ({ tabId, text }) => {
      setTerminalTabs(prev => prev.map(t => {
        if (t.id === tabId) {
          const nextLogs = [...t.logs, text];
          if (nextLogs.length > 500) nextLogs.shift();
          return { ...t, logs: nextLogs };
        }
        return t;
      }));
    });

    socket.on('chat_message', ({ message }) => {
      dispatch(addChat({
        _id: message._id,
        text: message.content,
        user: message.sender?.fullName || 'Collaborator',
        sender: message.sender,
        createdAt: message.createdAt
      }));
    });

    socket.on('typing', ({ userId, fullName, isTyping }) => {
      dispatch(setTyping({ userId, typing: { name: fullName, isTyping } }));
    });

    socket.on('task_created', ({ task }) => {
      dispatch(addTask(task));
    });

    socket.on('task_updated', ({ task }) => {
      dispatch(updateTask(task));
    });

    socket.on('task_completed', ({ task }) => {
      dispatch(updateTask(task));
      toast.success(`Task "${task.title}" completed!`);
    });

    socket.on('activity_added', ({ activity }) => {
      dispatch(addActivity(activity));
    });

    socket.on('file_tree_changed', ({ action, file, senderName }) => {
      fetchWorkspaceFilesAPI(workspaceId).then((res) => {
        if (res?.success) {
          dispatch(setFiles(res.data?.files || res.data || []));
          toast.success(`${senderName || 'Collaborator'} ${action} "${file?.name || 'file'}"`);
        }
      });
    });

    return () => {
      socket.emit('leave_workspace', { workspaceId });
      socket.off('workspace_joined');
      socket.off('member_joined');
      socket.off('member_left');
      socket.off('code_change');
      socket.off('cursor_move');
      socket.off('file_save');
      socket.off('preview_update');
      socket.off('terminal_output');
      socket.off('chat_message');
      socket.off('typing');
      socket.off('task_created');
      socket.off('task_updated');
      socket.off('task_completed');
      socket.off('activity_added');
      socket.off('file_tree_changed');
      socket.disconnect();
    };
  }, [workspaceId, currentUser, dispatch]);

  // Cursors decorations updates in Monaco Editor
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    const nextDecorations = [];
    Object.entries(cursors).forEach(([userId, cursor]) => {
      if (cursor && cursor.row && activeFile && cursor.filePath === activeFile.path) {
        nextDecorations.push({
          range: new monaco.Range(cursor.row, cursor.col, cursor.row, cursor.col + 1),
          options: {
            className: 'remote-cursor-line',
            hoverMessage: { value: `**${cursor.name}** is here` },
            inlineClassName: 'remote-cursor-inline'
          }
        });
      }
    });

    decorRef.current = editor.deltaDecorations(decorRef.current, nextDecorations);
  }, [cursors, activeFile]);

  // Injects styling rules for cursors (Green-themed matching CodeSphere)
  useEffect(() => {
    const styleId = 'monaco-cursors-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        .remote-cursor-line {
          border-left: 2px solid #04AA6D !important;
          margin-left: -1px;
        }
        .remote-cursor-inline {
          background-color: rgba(99, 102, 241, 0.15) !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  // Workspace Settings / CRUD Actions
  const handleUpdateWorkspaceSettings = async (payload) => {
    try {
      const res = await updateWorkspaceSettingsAPI(workspaceId, payload);
      if (res.success) {
        dispatch(setCurrentWorkspace(res.data));
        toast.success('Workspace updated successfully');
        socket.emit('activity_added', {
          workspaceId,
          activityType: 'workspace_updated',
          description: `Settings updated: ${payload.name}`
        });
      }
    } catch (err) {
      toast.error('Failed to update workspace');
    }
  };

  const handleArchiveWorkspace = async () => {
    try {
      const res = await archiveWorkspaceAPI(workspaceId);
      if (res.success) {
        toast.success('Workspace archived');
        navigate('/codex');
      }
    } catch (err) {
      toast.error('Failed to archive workspace');
    }
  };

  const handleRestoreWorkspace = async () => {
    try {
      const res = await restoreWorkspaceAPI(workspaceId);
      if (res.success) {
        dispatch(setCurrentWorkspace(res.data));
        toast.success('Workspace restored successfully');
        socket.emit('activity_added', {
          workspaceId,
          activityType: 'workspace_updated',
          description: `Restored workspace from archives`
        });
      }
    } catch (err) {
      toast.error('Failed to restore workspace');
    }
  };

  const handleDeleteWorkspace = async () => {
    try {
      const res = await deleteWorkspaceAPI(workspaceId);
      if (res.success) {
        toast.success('Workspace deleted');
        navigate('/codex');
      }
    } catch (err) {
      toast.error('Failed to delete workspace');
    }
  };

  const handleLeaveWorkspace = () => {
    toast.success('Left workspace');
    navigate('/codex');
  };

  const handleFollowUser = (user) => {
    if (!user) return;
    const userCursor = cursors[user._id];
    if (userCursor && userCursor.filePath) {
      dispatch(setActiveTab('code'));
      const targetFile = files.find(f => f.path === userCursor.filePath);
      if (targetFile) {
        dispatch(setActiveFile(targetFile));
      }
      if (editorRef.current && userCursor.row) {
        editorRef.current.revealLineInCenter(userCursor.row);
        editorRef.current.setPosition({ lineNumber: userCursor.row, column: userCursor.col || 1 });
      }
      toast.success(`Following ${user.fullName} at ${userCursor.filePath} (Ln ${userCursor.row})`);
    } else {
      toast(`Following ${user.fullName} (Active in workspace)`, { icon: '👀' });
    }
  };

  // Files CRUD wrappers
  const handleSelectFile = (file) => {
    dispatch(setActiveFile(file));
    socket.emit('file_open', { workspaceId, filePath: file.path });
  };

  const handleCreateFile = async (name, path) => {
    try {
      const res = await createWorkspaceFileAPI(workspaceId, { name, path, type: 'file' });
      if (res.success) {
        dispatch(addFile(res.data.file));
        dispatch(setActiveFile(res.data.file));
        socket.emit('file_tree_changed', { workspaceId, action: 'created', file: res.data.file });
        socket.emit('activity_added', { workspaceId, activityType: 'file_created', description: `Created file "${name}"` });
      }
    } catch (err) {
      toast.error('Error creating file');
    }
  };

  const handleCreateFolder = async (name, path) => {
    try {
      const res = await createWorkspaceFileAPI(workspaceId, { name, path, type: 'folder' });
      if (res.success) {
        dispatch(addFile(res.data.file));
        socket.emit('file_tree_changed', { workspaceId, action: 'created folder', file: res.data.file });
        socket.emit('activity_added', { workspaceId, activityType: 'file_created', description: `Created folder "${name}"` });
      }
    } catch (err) {
      toast.error('Error creating folder');
    }
  };

  const handleRenameFile = async (fileId, name, path) => {
    try {
      const res = await updateWorkspaceFileAPI(workspaceId, fileId, { name, path });
      if (res.success) {
        dispatch(updateFile(res.data.file));
        socket.emit('file_tree_changed', { workspaceId, action: 'renamed', file: res.data.file });
        const listRes = await fetchWorkspaceFilesAPI(workspaceId);
        if (listRes.success) dispatch(setFiles(listRes.data.files));
      }
    } catch (err) {
      toast.error('Error renaming file');
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const res = await deleteWorkspaceFileAPI(workspaceId, fileId);
      if (res.success) {
        dispatch(deleteFile(fileId));
        socket.emit('file_tree_changed', { workspaceId, action: 'deleted', file: { _id: fileId } });
        socket.emit('activity_added', { workspaceId, activityType: 'file_deleted', description: `Deleted file/folder` });
      }
    } catch (err) {
      toast.error('Error deleting file');
    }
  };

  const handleDuplicateFile = async (fileId) => {
    try {
      const res = await duplicateWorkspaceFileAPI(workspaceId, fileId);
      if (res.success) {
        dispatch(addFile(res.data.file));
      }
    } catch (err) {
      toast.error('Error duplicating file');
    }
  };

  const handleFileUpload = async (formData) => {
    try {
      const res = await uploadWorkspaceFileAPI(workspaceId, formData);
      if (res.success) {
        dispatch(addFile(res.data.file));
        toast.success('File uploaded');
      }
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  // Editor typing change sync
  const handleEditorChange = (value) => {
    if (!activeFile) return;
    dispatch(updateLocalCode({ filePath: activeFile.path, content: value }));
    socket.emit('code_change', { workspaceId, filePath: activeFile.path, content: value });
  };

  // Editor cursor movement sync
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.onDidChangeCursorPosition(e => {
      if (activeFile) {
        socket.emit('cursor_move', {
          workspaceId,
          filePath: activeFile.path,
          cursor: { row: e.position.lineNumber, col: e.position.column }
        });
      }
    });
  };

  const handleSaveFile = () => {
    if (!activeFile) return;
    socket.emit('file_save', {
      workspaceId,
      filePath: activeFile.path,
      content: activeFile.content
    });
    toast.success('Saved to server sandbox!');
  };

  const [isRunningCode, setIsRunningCode] = useState(false);

  const handleRunUniversalCode = async () => {
    if (!activeFile) {
      toast.error('Please select or create a file to run');
      return;
    }

    const currentCode = editorRef.current ? editorRef.current.getValue() : (activeFile.content || '');
    handleSaveFile();

    const fileName = activeFile.name || activeFile.path || 'main.js';
    let ext = 'js';
    if (fileName.includes('.')) {
      ext = fileName.split('.').pop().toLowerCase();
    }

    // If Web file, auto reload live preview
    if (ext === 'html' || ext === 'css') {
      setPreviewCacheBuster(Date.now());
      toast.success('Web live preview reloaded!');
      return;
    }

    setIsRunningCode(true);
    setActiveTermId('term-3'); // Switch to Output terminal tab
    const toastId = toast.loading(`Compiling & executing ${fileName}...`);

    try {
      const res = await runUniversalCodeAPI({
        code: currentCode,
        language: ext,
        input: ''
      });

      if (res.success && res.data) {
        const { output, error, statusText, executionTime } = res.data;
        const resultLog = [
          `=== Running ${fileName} (${ext.toUpperCase()}) ===`,
          `Status: ${statusText || 'Success'} | Duration: ${executionTime ? executionTime.toFixed(2) + 's' : '0.01s'}`,
          '----------------------------------------',
          output ? output : (error ? `ERROR:\n${error}` : '(No stdout output)'),
          '========================================',
          ''
        ].join('\n');

        setTerminalTabs(prev => prev.map(t => {
          if (t.id === 'term-3') {
            return { ...t, logs: [...t.logs, resultLog] };
          }
          return t;
        }));

        if (error && !output) {
          toast.error(`Execution error in ${fileName}`, { id: toastId });
        } else {
          toast.success(`Executed ${fileName} successfully!`, { id: toastId });
        }
      } else {
        toast.error(res.message || 'Execution failed', { id: toastId });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Error executing code', { id: toastId });
    } finally {
      setIsRunningCode(false);
    }
  };

  // Chat wrappers
  const handleSendMessage = (text) => {
    socket.emit('chat_message', { workspaceId, content: text });
  };

  const handlePinMessage = async (msgId) => {
    toast.success('Toggled pin message');
  };

  const handleSearchChat = async (query) => {
    try {
      const res = await searchWorkspaceChatsAPI(workspaceId, query);
      if (res.success) {
        return res.data.chats.map(c => ({
          text: c.content,
          user: c.sender?.fullName || 'Collaborator',
          sender: c.sender,
          createdAt: c.createdAt
        }));
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  };

  const handleTypingStart = () => {
    socket.emit('typing', { workspaceId, isTyping: true });
  };

  const handleTypingStop = () => {
    socket.emit('typing', { workspaceId, isTyping: false });
  };

  // Tasks Kanban board wrappers
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = async (taskPayload) => {
    try {
      const payload = {
        ...taskPayload,
        workspaceId,
        reporter: currentUser?._id
      };
      const res = await createWorkspaceTaskAPI(payload);
      if (res.success) {
        dispatch(addTask(res.data));
        socket.emit('task_created', { workspaceId, task: res.data });
        socket.emit('activity_added', { workspaceId, activityType: 'task_created', description: `Created task "${taskPayload.title}"` });
      }
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, taskPayload) => {
    try {
      const res = await updateWorkspaceTaskAPI(taskId, taskPayload);
      if (res.success) {
        dispatch(updateTask(res.data));
        socket.emit('task_updated', { workspaceId, task: res.data });
        
        if (taskPayload.status === 'completed') {
          socket.emit('task_completed', { workspaceId, task: res.data });
        }
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskStatusChange = async (task, nextStatus) => {
    await handleUpdateTask(task._id, { status: nextStatus });
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await deleteWorkspaceTaskAPI(taskId);
      if (res.success) {
        dispatch(deleteTask(taskId));
        toast.success('Task card deleted');
      }
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  // Terminal commands running
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const rawInput = termInputText.trim();
    if (!rawInput) return;

    // Handle clear screen command
    if (rawInput === 'clear' || rawInput === 'cls') {
      setTerminalTabs(prev => prev.map(t => {
        if (t.id === activeTermId) return { ...t, logs: [] };
        return t;
      }));
      setTermInputText('');
      return;
    }

    setTerminalTabs(prev => prev.map(t => {
      if (t.id === activeTermId) {
        return { ...t, logs: [...t.logs, `$ ${rawInput}`] };
      }
      return t;
    }));

    socket.emit('terminal_input', {
      workspaceId,
      tabId: activeTermId,
      input: rawInput + '\n'
    });

    setTermInputText('');

    socket.emit('activity_added', {
      workspaceId,
      activityType: 'terminal_used',
      description: `Executed command "${rawInput}" in terminal`
    });
  };

  // Invite member modal trigger
  const handleInviteUser = () => {
    setIsInviteModalOpen(true);
  };

  // Editor language detection
  const getEditorLanguage = (fileName) => {
    if (!fileName) return 'javascript';
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'html') return 'html';
    if (ext === 'css') return 'css';
    if (ext === 'js') return 'javascript';
    if (ext === 'py') return 'python';
    if (ext === 'cpp') return 'cpp';
    if (ext === 'json') return 'json';
    return 'javascript';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-[#04AA6D] animate-spin" />
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Loading Collaborative Codex...</span>
      </div>
    );
  }

  const previewUrl = `http://localhost:5000/preview/${workspaceId}/index.html?cb=${previewCacheBuster}`;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full text-slate-800 dark:text-slate-200 select-none overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* ─── Top Navbar ────────────────────────────────────────────────────────── */}
      <div className="h-14 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center justify-between px-5 z-20 shrink-0">
        <div className="flex items-center gap-3.5 text-left">
          <button 
            onClick={() => navigate('/codex')}
            title="Back to Codex Hub"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowRight size={16} className="rotate-180" />
          </button>
          
          <div className="p-2 bg-[#04AA6D]/10 text-[#04AA6D] rounded-lg">
            <FolderCode className="w-4 h-4" />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                {currentWorkspace?.name || 'Collaborative Workspace'}
              </h1>
              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/60 capitalize flex items-center gap-1">
                <Lock size={9} />
                {currentWorkspace?.visibility || 'private'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans truncate max-w-[220px]">
              {currentWorkspace?.description || 'Collaborative development space'}
            </span>
          </div>
        </div>

        {/* Global Workspace Search */}
        <div className="relative w-full max-w-sm hidden md:block">
          <input
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search workspace..."
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-8 py-1.5 text-xs outline-none text-slate-800 dark:text-slate-200 focus:border-[#04AA6D] font-sans transition-colors"
          />
          <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400 dark:text-slate-500" />
          <span className="absolute right-2.5 top-2 text-[9px] font-mono text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 px-1 rounded bg-white dark:bg-slate-900">
            ⌘K
          </span>
        </div>

        {/* Indicators & Right Navbar Actions */}
        <div className="flex items-center gap-3">
          {/* Online Users Avatar Stack */}
          <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-800/80 pr-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <div className="flex -space-x-1.5">
              {onlineUsers.slice(0, 4).map((user) => (
                <img 
                  key={user._id} 
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} 
                  alt={user.fullName} 
                  title={`Click to follow ${user.fullName}'s cursor`}
                  onClick={() => handleFollowUser(user)}
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-950 cursor-pointer hover:scale-110 transition-transform hover:z-10" 
                />
              ))}
              {onlineUsers.length > 4 && (
                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-700 dark:text-white font-mono">
                  +{onlineUsers.length - 4}
                </div>
              )}
            </div>
          </div>

          {/* Compact Voice Trigger */}
          <WorkspaceVoiceBar 
            socket={socket} 
            workspaceId={workspaceId} 
            currentUser={currentUser} 
            onlineUsers={onlineUsers} 
          />

          {/* GitHub Sync */}
          <button
            onClick={() => {
              setSessionModalMode('end');
              setIsSessionModalOpen(true);
            }}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700/60"
          >
            <GitBranch size={13} className="text-purple-400" />
            <span>GitHub Sync</span>
          </button>

          {/* Primary Invite Button */}
          <button 
            onClick={handleInviteUser}
            className="px-3 py-1 bg-[#04AA6D] hover:bg-emerald-600 active:scale-95 text-white text-xs font-mono font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1 transition-all"
          >
            <Plus size={13} />
            <span>Invite</span>
          </button>
        </div>
      </div>

      {/* ─── Secondary View Selector Bar ──────────────────────────────────────── */}
      <div className="h-10 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/60 flex items-center justify-between px-4 select-none shrink-0">
        <div className="flex gap-1">
          {[
            { id: 'code', label: 'Code Editor', icon: Code2 },
            { id: 'tasks', label: 'Tasks Kanban', icon: CheckSquare },
            { id: 'overview', label: 'Overview', icon: FolderCode },
            { id: 'discussions', label: 'Chat', icon: MessageSquare },
            { id: 'members', label: 'Members', icon: Users },
            { id: 'commits', label: 'Commits', icon: GitCommit },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveTab(tab.id))}
              className={`text-xs font-mono font-semibold px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-[#04AA6D] shadow-xs font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <tab.icon size={13} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Panel Visibility Toggle Controls */}
        {activeTab === 'code' && (
          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <button
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
              title={isLeftSidebarOpen ? "Collapse Left Sidebar" : "Expand Left Sidebar"}
              className={`px-2 py-1 text-[11px] font-mono rounded flex items-center gap-1 transition-colors cursor-pointer border ${
                isLeftSidebarOpen
                  ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#04AA6D]'
                  : 'border-transparent hover:text-slate-200'
              }`}
            >
              Sidebar
            </button>

            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              title={isRightPanelOpen ? "Collapse Live Preview" : "Expand Live Preview"}
              className={`px-2 py-1 text-[11px] font-mono rounded flex items-center gap-1 transition-colors cursor-pointer border ${
                isRightPanelOpen
                  ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#04AA6D]'
                  : 'border-transparent hover:text-slate-200'
              }`}
            >
              Preview Panel
            </button>
          </div>
        )}
      </div>

      {/* ─── Main Content Splitter ────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* CODE VIEW 3-COLUMN LAYOUT */}
        {activeTab === 'code' ? (
          <div className="flex-1 flex overflow-hidden min-h-0">
            
            {/* COLUMN 1: LEFT SIDEBAR PANEL */}
            {isLeftSidebarOpen && (
              <div className="w-[260px] border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex flex-col p-3 overflow-hidden shrink-0">
                {/* Sidebar Header Segmented Switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg mb-3 shrink-0">
                  <button
                    onClick={() => setSidebarTab('files')}
                    className={`flex-1 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                      sidebarTab === 'files'
                        ? 'bg-white dark:bg-slate-800 text-[#04AA6D] shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Files
                  </button>
                  <button
                    onClick={() => setSidebarTab('info')}
                    className={`flex-1 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                      sidebarTab === 'info'
                        ? 'bg-white dark:bg-slate-800 text-[#04AA6D] shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Info
                  </button>
                  <button
                    onClick={() => setSidebarTab('collaborators')}
                    className={`flex-1 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                      sidebarTab === 'collaborators'
                        ? 'bg-white dark:bg-slate-800 text-[#04AA6D] shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Team
                  </button>
                </div>

                {/* Sidebar Tab Content */}
                {sidebarTab === 'files' ? (
                  <div className="flex-1 flex flex-col min-h-0">
                    <WorkspaceFiles
                      files={files}
                      activeFile={activeFile}
                      activeCursors={cursors}
                      onSelectFile={handleSelectFile}
                      onCreateFile={handleCreateFile}
                      onCreateFolder={handleCreateFolder}
                      onRename={handleRenameFile}
                      onDelete={handleDeleteFile}
                      onDuplicate={handleDuplicateFile}
                      onUpload={handleFileUpload}
                    />
                  </div>
                ) : sidebarTab === 'info' ? (
                  <div className="flex-1 overflow-y-auto space-y-4 p-1 text-left">
                    <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3.5 space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Project Summary</span>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-500">
                          <span>Tech Stack</span>
                          <div className="flex gap-1 font-mono text-[9px]">
                            <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">React</span>
                            <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">Node</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 text-[11px]">
                          <span className="text-slate-500">Repository</span>
                          <a 
                            href={`https://${currentWorkspace?.githubRepo || 'github.com/codesphere/sandbox'}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#04AA6D] hover:underline font-mono truncate"
                          >
                            {currentWorkspace?.githubRepo || 'github.com/codesphere/sandbox'}
                          </a>
                        </div>
                        <div className="flex justify-between items-center text-slate-500">
                          <span>Owner</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-200">Arjun Verma</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500">
                          <span>Created On</span>
                          <span className="font-mono text-slate-600 dark:text-slate-400">12 Apr 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-3 p-1 text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block mb-2">Live Collaborators</span>
                    {[
                      { name: 'Priya Sharma', path: 'src/pages/Home.jsx', line: 45, color: '#9c27b0' },
                      { name: 'Rohan Mehta', path: 'src/components/Navbar.jsx', line: 22, color: '#3f51b5' },
                      { name: 'Neha Gupta', path: 'src/context/CartContext.jsx', line: 10, color: '#04AA6D' }
                    ].map((cur, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cur.color }} />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{cur.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono truncate">{cur.path}:{cur.line}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleFollowUser({ fullName: cur.name })}
                          className="text-[9px] font-mono text-[#04AA6D] hover:underline font-bold"
                        >
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COLUMN 2: MIDDLE EDITOR CORE */}
            <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800/80 overflow-hidden min-w-0">
              
              {/* File tabs bar */}
              <div className="h-10 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900 flex items-center justify-between px-3 select-none shrink-0">
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                  {files.filter(f => f.type === 'file').slice(0, 6).map((file) => (
                    <button
                      key={file._id}
                      onClick={() => handleSelectFile(file)}
                      className={`text-xs font-mono font-semibold px-3 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-2 ${
                        activeFile && activeFile._id === file._id
                          ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 text-[#04AA6D] shadow-xs font-bold'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                    >
                      <span>{file.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleRunUniversalCode}
                    disabled={isRunningCode}
                    title="Run Active File (Python, JS, TS, C, C++, Java, Go, Rust, PHP, Ruby, Bash, etc.)"
                    className="px-3 py-1 bg-[#04AA6D] hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-white text-[11px] font-mono font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    {isRunningCode ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                    <span>{isRunningCode ? 'Running...' : 'Run Code'}</span>
                  </button>

                  <button 
                    onClick={handleSaveFile}
                    className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#04AA6D] text-[11px] font-mono font-bold rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Save size={12} />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Path Breadcrumbs */}
              <div className="h-7 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800/60 px-4 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span>frontend</span>
                  <span>/</span>
                  <span>src</span>
                  <span>/</span>
                  <span>pages</span>
                  <span>/</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{activeFile?.name || 'index.html'}</span>
                </div>
                <span>You, live editing</span>
              </div>

              {/* Monaco Code Editor Workspace */}
              <div className="flex-1 min-h-[220px] bg-white dark:bg-slate-900/20">
                {activeFile ? (
                  <Editor
                    height="100%"
                    language={getEditorLanguage(activeFile.name)}
                    theme={isDarkMode ? 'vs-dark' : 'light'}
                    value={activeFile.content || ''}
                    onChange={handleEditorChange}
                    onMount={handleEditorMount}
                    options={{
                      minimap: { enabled: true },
                      fontSize: 12,
                      lineNumbers: 'on',
                      wordWrap: 'on',
                      automaticLayout: true,
                      scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                      padding: { top: 10 }
                    }}
                  />
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center gap-2">
                    <FolderCode size={30} className="text-slate-300 dark:text-slate-700 animate-bounce" />
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">Select a file to edit</span>
                  </div>
                )}
              </div>

              {/* Editor Status Bar */}
              <div className="h-7 bg-slate-100/50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/60 px-4 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 select-none shrink-0">
                <div className="flex items-center gap-3">
                  <span>Ln 45, Col 12</span>
                  <span>UTF-8</span>
                  <span>JavaScript JSX</span>
                </div>
                <div className="flex items-center gap-1 text-[#04AA6D] font-bold hover:underline cursor-pointer">
                  <Play size={10} />
                  <span>Ready</span>
                </div>
              </div>

              {/* Full-width Clean Terminal & Output Panel */}
              <div className="h-[210px] border-t border-slate-200 dark:border-slate-800/80 bg-slate-900 dark:bg-slate-950 flex flex-col overflow-hidden select-text shrink-0">
                <div className="h-8 border-b border-slate-800 flex items-center justify-between px-3 bg-slate-950/80 select-none shrink-0">
                  <div className="flex gap-1.5">
                    {terminalTabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTermId(tab.id)}
                        className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded transition-all cursor-pointer ${
                          activeTermId === tab.id
                            ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Node JS Sandbox</span>
                </div>
                
                <div 
                  ref={terminalLogsRef} 
                  className="flex-1 p-3 font-mono text-[11px] leading-relaxed text-slate-300 overflow-y-auto no-scrollbar flex flex-col gap-0.5"
                >
                  {terminalTabs.find(t => t.id === activeTermId)?.logs.map((logLine, idx) => (
                    <div key={idx} className="whitespace-pre-wrap">{logLine}</div>
                  ))}
                </div>
                
                <form onSubmit={handleTerminalSubmit} className="p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-emerald-400 select-none">$</span>
                  <input
                    value={termInputText}
                    onChange={(e) => setTermInputText(e.target.value)}
                    placeholder="Type command..."
                    className="flex-1 bg-transparent border-none outline-none font-mono text-[11px] text-white"
                  />
                </form>
              </div>
            </div>

            {/* COLUMN 3: RIGHT PANEL (Live Preview & Tools) */}
            {isRightPanelOpen && (
              <div className="w-[380px] lg:w-[400px] flex flex-col overflow-hidden shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800/80">
                
                {/* Live Preview Panel (Top half) */}
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                  <div className="h-10 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-3 bg-slate-100/60 dark:bg-slate-900 select-none shrink-0">
                    <div className="flex gap-1.5">
                      {['Live Preview', 'API Tester'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setPreviewTab(tab.toLowerCase().includes('api') ? 'api' : 'preview')}
                          className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                            (previewTab === 'api' && tab.includes('API')) || (previewTab !== 'api' && !tab.includes('API'))
                              ? 'bg-white dark:bg-slate-800 text-[#04AA6D] shadow-xs'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setPreviewCacheBuster(Date.now())}
                        title="Reload Preview Frame"
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        <RefreshCw size={12} />
                      </button>
                      <a 
                        href={previewUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        title="Open Preview in New Window"
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        <Link2 size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Preview view */}
                  <div className="flex-1 bg-slate-50 dark:bg-slate-950/20 p-2.5 flex flex-col overflow-hidden min-h-0">
                    {previewTab === 'api' ? (
                      <APITester />
                    ) : (
                      <div className="flex-1 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-md flex flex-col overflow-hidden">
                        <div className="h-6 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-2.5 gap-1.5 shrink-0">
                          <div className="flex gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          </div>
                          <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-[8px] font-mono text-slate-400 dark:text-slate-500 px-2 py-0.5 select-text truncate text-left">
                            https://codesphere.live/sandbox-preview
                          </div>
                        </div>
                        <iframe
                          src={previewUrl}
                          title="Live sandbox compiler frame"
                          className="flex-1 border-none bg-slate-950"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Tools Panel (Tabbed Tasks vs Activity Feed) */}
                <div className="h-[210px] border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex flex-col overflow-hidden select-none shrink-0">
                  <div className="h-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 bg-slate-50 dark:bg-slate-950/40">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRightWidgetTab('tasks')}
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          rightWidgetTab === 'tasks' ? 'text-[#04AA6D]' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Tasks ({tasks.length})
                      </button>
                      <button
                        onClick={() => setRightWidgetTab('activity')}
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          rightWidgetTab === 'activity' ? 'text-[#04AA6D]' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Activity Stream
                      </button>
                    </div>
                    <button 
                      onClick={() => dispatch(setActiveTab(rightWidgetTab === 'tasks' ? 'tasks' : 'activity'))} 
                      className="text-[9px] text-[#04AA6D] hover:underline font-mono uppercase font-bold"
                    >
                      View All
                    </button>
                  </div>
                  
                  {rightWidgetTab === 'tasks' ? (
                    <div className="flex-1 p-2.5 overflow-y-auto no-scrollbar space-y-1.5 text-left">
                      {tasks.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/60 rounded-lg">
                          <input 
                            type="checkbox" 
                            checked={item.status === 'completed'}
                            onChange={() => handleTaskStatusChange(item, item.status === 'completed' ? 'todo' : 'completed')}
                            className="rounded accent-[#04AA6D] cursor-pointer"
                          />
                          <span className={`text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate flex-1 ${item.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                            {item.title}
                          </span>
                          <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase bg-emerald-500/10 text-emerald-400">
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                      
                      <button 
                        onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }}
                        className="w-full py-1 border border-dashed border-slate-300 dark:border-slate-800 hover:border-[#04AA6D] text-slate-500 hover:text-[#04AA6D] rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus size={11} />
                        <span>New Task Card</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 p-2.5 overflow-y-auto no-scrollbar space-y-2 text-left">
                      {activities.slice(0, 5).map((act, idx) => {
                        const user = act.userId || {};
                        const userName = user.fullName || 'Collaborator';
                        return (
                          <div key={idx} className="flex items-start gap-2 text-[11px]">
                            <img src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} className="w-4 h-4 rounded-full bg-slate-800 mt-0.5" alt="" />
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{userName}</span>
                              <span className="text-[10px] text-slate-400 line-clamp-1">{act.description}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        ) : activeTab === 'overview' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 text-left">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white font-mono uppercase tracking-wider mb-4">Workspace Overview</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              Welcome to the collaborative playground dashboard. Start by navigating to the **Code Editor** tab to open Monaco and term shells, or assign cards inside the **Tasks** checklist.
            </p>
          </div>
        ) : activeTab === 'tasks' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center mb-6 text-left">
              <div className="flex items-center gap-2">
                <CheckSquare size={18} className="text-[#04AA6D]" />
                <span className="text-xs font-bold text-slate-850 dark:text-white tracking-widest uppercase font-mono">Tasks Kanban List</span>
              </div>
              <Button size="xs" icon={Plus} onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }} className="bg-[#04AA6D] hover:bg-emerald-600">Add Task</Button>
            </div>
            <KanbanBoard 
              tasks={tasks} 
              onTaskStatusChange={handleTaskStatusChange} 
              onTaskClick={handleTaskClick}
            />
          </div>
        ) : activeTab === 'members' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 max-w-2xl mx-auto w-full">
            <WorkspaceMembers 
              members={members} 
              onlineUsers={onlineUsers} 
              currentUser={currentUser}
              onRemove={(id) => handleUpdateWorkspaceSettings({ removeMemberId: id })}
              onPromote={(id, r) => handleUpdateWorkspaceSettings({ promoteMemberId: id, promoteRole: r })}
              onTransferOwnership={(id) => handleUpdateWorkspaceSettings({ transferOwnershipId: id })}
            />
          </div>
        ) : activeTab === 'discussions' ? (
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            <WorkspaceChat
              messages={chats}
              onSendMessage={handleSendMessage}
              onPinMessage={handlePinMessage}
              onSearchChat={handleSearchChat}
              typingUsers={typingUsers}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
            />
          </div>
        ) : activeTab === 'activity' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 max-w-2xl mx-auto w-full">
            <ActivityFeed activities={activities} />
          </div>
        ) : activeTab === 'commits' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 max-w-2xl mx-auto w-full">
            <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl text-left select-none p-6">
              <h2 className="text-sm font-bold text-slate-850 dark:text-white font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-[#04AA6D]" />
                Repository Commit History
              </h2>
              <div className="space-y-4">
                {gitHistory.map((git, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-xl hover:border-[#04AA6D]/20 transition-all">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${git.author}`} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 mt-0.5" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{git.author}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-[#04AA6D] font-mono px-2 py-0.5 rounded">{git.commit}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 font-sans">{git.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 max-w-2xl mx-auto w-full">
            <WorkspaceSettings 
              workspace={currentWorkspace} 
              currentUser={currentUser}
              onUpdateSettings={handleUpdateWorkspaceSettings}
              onArchive={handleArchiveWorkspace}
              onRestore={handleRestoreWorkspace}
              onDelete={handleDeleteWorkspace}
              onLeave={handleLeaveWorkspace}
            />
          </div>
        )}

      </div>

      {/* Kanban Task Creation/Editing Modal Dialog */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
        onAdd={handleAddTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        members={members}
      />

      {/* Session Manager Modal (Start & End of Session GitHub/Storage Workflow) */}
      <SessionManagerModal
        isOpen={isSessionModalOpen}
        mode={sessionModalMode}
        isGitHubImported={isGitHubImported}
        githubRepoUrl={activeRepoUrl}
        workspaceId={workspaceId}
        onStartSession={handleStartSessionFlow}
        onEndSession={handleEndSessionFlow}
        onClose={() => setIsSessionModalOpen(false)}
      />

      {/* Enhanced Workspace Invite Modal (Direct Link Copying & Email Invites) */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        workspace={currentWorkspace}
        workspaceId={workspaceId}
      />
    </div>
  );
};
export default Workspace;
