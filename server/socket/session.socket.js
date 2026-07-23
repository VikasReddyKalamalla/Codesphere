const socketService = require('../services/socket.service');
const sessionService = require('../services/sessionSocket.service');
const presenceService = require('../services/presence.service');
const activityService = require('../services/activity.service');

/**
 * Attach live session event handlers.
 *
 * Client events:
 *   session:join        { sessionId }
 *   session:leave       { sessionId }
 *   session:message     { sessionId, content }
 *   session:setLive     { sessionId, isLive }    (host only)
 *   session:announce    { sessionId, message }   (host only)
 *   session:history     { sessionId }
 *
 * Server events emitted:
 *   session:joined      { tracking, history }
 *   session:participantJoined { participant, participantCount }
 *   session:participantLeft   { userId, participantCount }
 *   session:newMessage  { message }
 *   session:statusChanged { isLive }
 *   session:announcement  { message, host }
 *   session:error       { message }
 */
const handleSession = (socket, io) => {
  // ─── Join session ───────────────────────────────────────────────────────────
  socket.on('session:join', async ({ sessionId }) => {
    try {
      const roomKey = `session:${sessionId}`;
      const isHost = socket.user.role === 'instructor' || socket.user.role === 'admin';

      await socketService.getOrCreateRoom({
        roomKey,
        type: 'session',
        referenceId: sessionId,
        referenceModel: 'LiveSession',
        createdBy: socket.user._id,
      });

      socket.join(roomKey);
      await socketService.addUserToRoom(roomKey, socket.user._id);
      await presenceService.updateContext(socket.user._id, {
        currentRoom: roomKey,
        currentSession: sessionId,
      });

      const [tracking, history] = await Promise.all([
        sessionService.addParticipant(sessionId, socket.user._id, socket.id, isHost ? 'host' : 'participant'),
        sessionService.getSessionMessages(sessionId, { limit: 30 }),
      ]);

      socket.emit('session:joined', { tracking, history });

      io.to(roomKey).emit('session:participantJoined', {
        participant: {
          user: {
            _id: socket.user._id,
            fullName: socket.user.fullName,
            username: socket.user.username,
            avatar: socket.user.avatar,
          },
          role: isHost ? 'host' : 'participant',
        },
        participantCount: tracking?.participantCount || 0,
      });

      await activityService.log({
        userId: socket.user._id,
        module: 'Session',
        action: 'joined_session',
        referenceId: sessionId,
        referenceType: 'LiveSession',
        socketId: socket.id,
      });
    } catch (err) {
      socket.emit('session:error', { message: err.message });
    }
  });

  // ─── Leave session ──────────────────────────────────────────────────────────
  socket.on('session:leave', async ({ sessionId }) => {
    const roomKey = `session:${sessionId}`;
    socket.leave(roomKey);
    await socketService.removeUserFromRoom(roomKey, socket.user._id);

    const tracking = await sessionService.removeParticipant(sessionId, socket.user._id);

    io.to(roomKey).emit('session:participantLeft', {
      userId: socket.user._id,
      participantCount: tracking?.participantCount || 0,
    });

    await activityService.log({
      userId: socket.user._id,
      module: 'Session',
      action: 'left_session',
      referenceId: sessionId,
      referenceType: 'LiveSession',
      socketId: socket.id,
    });
  });

  // ─── Session chat message ───────────────────────────────────────────────────
  socket.on('session:message', async ({ sessionId, content }) => {
    try {
      if (!content?.trim()) return;
      const message = await sessionService.saveSessionMessage({
        senderId: socket.user._id,
        sessionId,
        content: content.trim(),
      });
      io.to(`session:${sessionId}`).emit('session:newMessage', { message });
    } catch (err) {
      socket.emit('session:error', { message: err.message });
    }
  });

  // ─── Toggle session live status (host/admin only) ───────────────────────────
  socket.on('session:setLive', async ({ sessionId, isLive }) => {
    if (!['instructor', 'admin'].includes(socket.user.role)) {
      return socket.emit('session:error', { message: 'Only hosts can change session status' });
    }
    const roomKey = `session:${sessionId}`;
    await sessionService.setSessionLive(sessionId, isLive);
    io.to(roomKey).emit('session:statusChanged', { isLive });
  });

  // ─── Host announcement ──────────────────────────────────────────────────────
  socket.on('session:announce', ({ sessionId, message: announcement }) => {
    if (!['instructor', 'admin'].includes(socket.user.role)) {
      return socket.emit('session:error', { message: 'Only hosts can make announcements' });
    }
    io.to(`session:${sessionId}`).emit('session:announcement', {
      message: announcement,
      host: {
        _id: socket.user._id,
        fullName: socket.user.fullName,
      },
    });
  });

  // ─── Session chat history ───────────────────────────────────────────────────
  socket.on('session:history', async ({ sessionId }) => {
    try {
      const messages = await sessionService.getSessionMessages(sessionId, { limit: 50 });
      socket.emit('session:history', { messages });
    } catch (err) {
      socket.emit('session:error', { message: err.message });
    }
  });

  // ─── Q&A events ─────────────────────────────────────────────────────────────
  socket.on('session:question:add', ({ sessionId, question }) => {
    io.to(`session:${sessionId}`).emit('session:question:added', { question });
  });

  socket.on('session:question:answer', ({ sessionId, answer, questionId }) => {
    io.to(`session:${sessionId}`).emit('session:question:answered', { answer, questionId });
  });

  socket.on('session:question:vote', ({ sessionId, question }) => {
    io.to(`session:${sessionId}`).emit('session:question:voted', { question });
  });

  socket.on('session:question:pin', ({ sessionId, question }) => {
    io.to(`session:${sessionId}`).emit('session:question:pinned', { question });
  });

  socket.on('session:question:markAnswered', ({ sessionId, question }) => {
    io.to(`session:${sessionId}`).emit('session:question:markedAnswered', { question });
  });

  // ─── Polls events ───────────────────────────────────────────────────────────
  socket.on('session:poll:create', ({ sessionId, poll }) => {
    io.to(`session:${sessionId}`).emit('session:poll:created', { poll });
  });

  socket.on('session:poll:vote', ({ sessionId, poll }) => {
    io.to(`session:${sessionId}`).emit('session:poll:voted', { poll });
  });

  socket.on('session:poll:close', ({ sessionId, poll }) => {
    io.to(`session:${sessionId}`).emit('session:poll:closed', { poll });
  });

  // ─── Quizzes events ─────────────────────────────────────────────────────────
  socket.on('session:quiz:create', ({ sessionId, quiz }) => {
    io.to(`session:${sessionId}`).emit('session:quiz:created', { quiz });
  });

  socket.on('session:quiz:start', ({ sessionId, quiz }) => {
    io.to(`session:${sessionId}`).emit('session:quiz:started', { quiz });
  });

  socket.on('session:quiz:submit', ({ sessionId, leaderboard }) => {
    io.to(`session:${sessionId}`).emit('session:quiz:submitted', { leaderboard });
  });

  socket.on('session:quiz:finish', ({ sessionId, quizId, leaderboard }) => {
    io.to(`session:${sessionId}`).emit('session:quiz:finished', { quizId, leaderboard });
  });

  // ─── Hand Raise events ──────────────────────────────────────────────────────
  socket.on('session:hand:raise', ({ sessionId }) => {
    io.to(`session:${sessionId}`).emit('session:hand:raised', {
      user: {
        _id: socket.user._id,
        fullName: socket.user.fullName,
        avatar: socket.user.avatar,
      },
    });
  });

  socket.on('session:hand:lower', ({ sessionId }) => {
    io.to(`session:${sessionId}`).emit('session:hand:lowered', {
      userId: socket.user._id,
    });
  });

  socket.on('session:hand:approve', ({ sessionId, targetUserId }) => {
    if (!['instructor', 'admin'].includes(socket.user.role)) {
      return socket.emit('session:error', { message: 'Only hosts can approve hand raises' });
    }
    io.to(`session:${sessionId}`).emit('session:hand:approved', { targetUserId });
  });

  // ─── Collaborative Code Editor Sync ─────────────────────────────────────────
  socket.on('session:code:sync', ({ sessionId, code, language, selection }) => {
    socket.to(`session:${sessionId}`).emit('session:code:synced', {
      code,
      language,
      selection,
      senderId: socket.user._id,
    });
  });

  // ─── Whiteboard Coordinates Sync ────────────────────────────────────────────
  socket.on('session:whiteboard:draw', ({ sessionId, drawAction }) => {
    socket.to(`session:${sessionId}`).emit('session:whiteboard:drawn', {
      drawAction,
      senderId: socket.user._id,
    });
  });

  // ─── Shared Notes Sync ──────────────────────────────────────────────────────
  socket.on('session:notes:sync', ({ sessionId, notes }) => {
    socket.to(`session:${sessionId}`).emit('session:notes:synced', {
      notes,
      senderId: socket.user._id,
    });
  });

  // ─── WebRTC Signaling Relay ──────────────────────────────────────────────────
  socket.on('session:signal', ({ targetUserId, signalData }) => {
    // Forward signaling message directly to targeted user's room
    io.to(`user:${targetUserId}`).emit('session:signal', {
      fromUserId: socket.user._id,
      signalData,
    });
  });
};

module.exports = { handleSession };
