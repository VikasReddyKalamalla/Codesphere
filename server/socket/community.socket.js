const socketService = require('../services/socket.service');
const communityService = require('../services/communitySocket.service');
const presenceService = require('../services/presence.service');
const activityService = require('../services/activity.service');

/**
 * Attach community chat event handlers to a socket.
 *
 * Client events handled:
 *   chat:join          { communityId }
 *   chat:leave         { communityId }
 *   chat:message       { communityId, content, replyTo? }
 *   chat:edit          { messageId, communityId, content }
 *   chat:delete        { messageId, communityId }
 *   chat:react         { messageId, communityId, emoji }
 *   chat:pin           { messageId, communityId, pin }
 *   chat:read          { messageId }
 *   chat:history       { communityId, page?, limit? }
 *   chat:typing        { communityId }
 *   chat:stopTyping    { communityId }
 *
 * Server events emitted:
 *   chat:joined        { roomKey, users, history }
 *   chat:userJoined    { user }
 *   chat:userLeft      { userId }
 *   chat:newMessage    { message }
 *   chat:messageEdited { message }
 *   chat:messageDeleted{ messageId }
 *   chat:reacted       { messageId, reactions }
 *   chat:pinned        { message }
 *   chat:typing        { user }
 *   chat:stopTyping    { userId }
 *   chat:error         { message }
 */
const handleCommunity = (socket, io) => {
  // ─── Join community chat room ───────────────────────────────────────────────
  socket.on('chat:join', async ({ communityId }) => {
    try {
      const roomKey = `community:${communityId}`;

      await socketService.getOrCreateRoom({
        roomKey,
        type: 'community',
        referenceId: communityId,
        referenceModel: 'Community',
        createdBy: socket.user._id,
      });

      socket.join(roomKey);
      await socketService.addUserToRoom(roomKey, socket.user._id);
      await presenceService.updateContext(socket.user._id, { currentRoom: roomKey });

      const [history, users] = await Promise.all([
        communityService.getMessageHistory(roomKey, { limit: 50 }),
        socketService.getRoomUsers(roomKey),
      ]);

      // Confirm join to the connecting client
      socket.emit('chat:joined', { roomKey, users, history });

      // Notify others in the room
      socket.to(roomKey).emit('chat:userJoined', {
        user: {
          _id: socket.user._id,
          fullName: socket.user.fullName,
          username: socket.user.username,
          avatar: socket.user.avatar,
        },
      });

      await activityService.log({
        userId: socket.user._id,
        module: 'Community',
        action: 'joined_room',
        referenceId: communityId,
        referenceType: 'Community',
        socketId: socket.id,
      });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  // ─── Leave community chat room ──────────────────────────────────────────────
  socket.on('chat:leave', async ({ communityId }) => {
    const roomKey = `community:${communityId}`;
    socket.leave(roomKey);
    await socketService.removeUserFromRoom(roomKey, socket.user._id);

    socket.to(roomKey).emit('chat:userLeft', { userId: socket.user._id });

    await activityService.log({
      userId: socket.user._id,
      module: 'Community',
      action: 'left_room',
      referenceId: communityId,
      referenceType: 'Community',
      socketId: socket.id,
    });
  });

  // ─── Send message ───────────────────────────────────────────────────────────
  socket.on('chat:message', async ({ communityId, content, replyTo }) => {
    try {
      if (!content?.trim()) return;

      const roomKey = `community:${communityId}`;
      const message = await communityService.saveMessage({
        senderId: socket.user._id,
        room: roomKey,
        content: content.trim(),
        replyTo,
      });

      io.to(roomKey).emit('chat:newMessage', { message });

      await activityService.log({
        userId: socket.user._id,
        module: 'Community',
        action: 'sent_message',
        referenceId: communityId,
        referenceType: 'Community',
        socketId: socket.id,
      });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  // ─── Edit message ───────────────────────────────────────────────────────────
  socket.on('chat:edit', async ({ messageId, communityId, content }) => {
    try {
      const message = await communityService.editMessage(messageId, socket.user._id, content);
      const roomKey = `community:${communityId}`;
      io.to(roomKey).emit('chat:messageEdited', { message });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  // ─── Delete message ─────────────────────────────────────────────────────────
  socket.on('chat:delete', async ({ messageId, communityId }) => {
    try {
      const message = await communityService.deleteMessage(
        messageId,
        socket.user._id,
        socket.user.role
      );
      const roomKey = `community:${communityId}`;
      io.to(roomKey).emit('chat:messageDeleted', { messageId: message._id });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  // ─── React to message ───────────────────────────────────────────────────────
  socket.on('chat:react', async ({ messageId, communityId, emoji }) => {
    try {
      const reactions = await communityService.reactToMessage(
        messageId,
        socket.user._id,
        emoji
      );
      const roomKey = `community:${communityId}`;
      io.to(roomKey).emit('chat:reacted', { messageId, reactions });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  // ─── Pin message ────────────────────────────────────────────────────────────
  socket.on('chat:pin', async ({ messageId, communityId, pin = true }) => {
    try {
      const roomKey = `community:${communityId}`;
      const message = await communityService.pinMessage(messageId, roomKey, pin);
      io.to(roomKey).emit('chat:pinned', { message, pin });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  // ─── Read receipt ───────────────────────────────────────────────────────────
  socket.on('chat:read', async ({ messageId }) => {
    await communityService.markMessageRead(messageId, socket.user._id);
  });

  // ─── Message history ────────────────────────────────────────────────────────
  socket.on('chat:history', async ({ communityId, page = 1, limit = 50 }) => {
    try {
      const roomKey = `community:${communityId}`;
      const messages = await communityService.getMessageHistory(roomKey, { page, limit });
      socket.emit('chat:history', { messages, page });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  // ─── Typing indicator ───────────────────────────────────────────────────────
  socket.on('chat:typing', ({ communityId }) => {
    const roomKey = `community:${communityId}`;
    socket.to(roomKey).emit('chat:typing', {
      user: {
        _id: socket.user._id,
        fullName: socket.user.fullName,
        username: socket.user.username,
      },
    });
  });

  socket.on('chat:stopTyping', ({ communityId }) => {
    const roomKey = `community:${communityId}`;
    socket.to(roomKey).emit('chat:stopTyping', { userId: socket.user._id });
  });
};

module.exports = { handleCommunity };
