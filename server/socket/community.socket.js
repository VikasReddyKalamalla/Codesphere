const socketService = require('../services/socket.service');
const communityService = require('../services/communitySocket.service');
const presenceService = require('../services/presence.service');
const activityService = require('../services/activity.service');
const Channel = require('../models/Channel');
const DirectChat = require('../models/DirectChat');

/**
 * Enterprise Community & WhatsApp-style Direct Messaging Socket Controller
 */
const handleCommunity = (socket, io) => {
  // ─── 1. Channel Join & Leave ────────────────────────────────────────────────
  socket.on('channel:join', async ({ channelId, communityId }) => {
    try {
      const roomKey = `channel:${channelId}`;
      socket.join(roomKey);

      await socketService.getOrCreateRoom({
        roomKey,
        type: 'community',
        referenceId: channelId,
        referenceModel: 'Channel',
        createdBy: socket.user._id,
      });

      await socketService.addUserToRoom(roomKey, socket.user._id);
      await presenceService.updateContext(socket.user._id, { currentRoom: roomKey });

      const [history, users] = await Promise.all([
        communityService.getMessageHistory(roomKey, { limit: 50 }),
        socketService.getRoomUsers(roomKey),
      ]);

      socket.emit('channel:joined', { channelId, roomKey, users, history });

      socket.to(roomKey).emit('chat:userJoined', {
        roomKey,
        user: {
          _id: socket.user._id,
          fullName: socket.user.fullName,
          username: socket.user.username,
          avatar: socket.user.avatar,
          role: socket.user.role,
        },
      });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  socket.on('channel:leave', async ({ channelId }) => {
    const roomKey = `channel:${channelId}`;
    socket.leave(roomKey);
    await socketService.removeUserFromRoom(roomKey, socket.user._id);
    socket.to(roomKey).emit('chat:userLeft', { roomKey, userId: socket.user._id });
  });

  // ─── 2. Channel Send Message ────────────────────────────────────────────────
  socket.on('channel:message', async (data) => {
    try {
      const { channelId, communityId, content, type = 'text', codeSnippet, attachments, replyTo } = data;
      if (!content?.trim() && (!codeSnippet || !codeSnippet.code)) return;

      const roomKey = `channel:${channelId}`;

      const message = await communityService.saveMessage({
        senderId: socket.user._id,
        room: roomKey,
        channelId,
        communityId,
        content: content ? content.trim() : (type === 'code' ? 'Code Snippet' : ''),
        type,
        codeSnippet,
        attachments,
        replyTo,
      });

      // Broadcast new message via Redis-adapted Socket.io
      io.to(roomKey).emit('chat:newMessage', { roomKey, message });

      // Notify community overview channel
      io.to(`community:${communityId}`).emit('community:channelActivity', {
        channelId,
        lastMessage: message,
      });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  // ─── 3. WhatsApp Direct Chat (1-on-1 & Group DM) ───────────────────────────
  socket.on('direct:join', async ({ directChatId }) => {
    try {
      const roomKey = `direct:${directChatId}`;
      socket.join(roomKey);

      await socketService.getOrCreateRoom({
        roomKey,
        type: 'private',
        referenceId: directChatId,
        referenceModel: 'DirectChat',
        createdBy: socket.user._id,
      });

      await socketService.addUserToRoom(roomKey, socket.user._id);

      const history = await communityService.getMessageHistory(roomKey, { limit: 50 });
      socket.emit('direct:joined', { directChatId, roomKey, history });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  socket.on('direct:leave', async ({ directChatId }) => {
    const roomKey = `direct:${directChatId}`;
    socket.leave(roomKey);
    await socketService.removeUserFromRoom(roomKey, socket.user._id);
  });

  socket.on('direct:message', async (data) => {
    try {
      const { directChatId, content, type = 'text', codeSnippet, attachments, replyTo } = data;
      if (!content?.trim() && (!codeSnippet || !codeSnippet.code)) return;

      const roomKey = `direct:${directChatId}`;

      const message = await communityService.saveMessage({
        senderId: socket.user._id,
        room: roomKey,
        directChatId,
        content: content ? content.trim() : '',
        type,
        codeSnippet,
        attachments,
        replyTo,
      });

      io.to(roomKey).emit('chat:newMessage', { roomKey, message });

      // Notify recipient personal rooms so they get an instant unread ping
      const chat = await DirectChat.findById(directChatId);
      if (chat && chat.participants) {
        chat.participants.forEach((pId) => {
          if (pId.toString() !== socket.user._id.toString()) {
            io.to(`user:${pId}`).emit('direct:newNotification', {
              directChatId,
              message,
              sender: {
                _id: socket.user._id,
                fullName: socket.user.fullName,
                avatar: socket.user.avatar,
              },
            });
          }
        });
      }
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  // ─── 4. WhatsApp Delivery & Read Receipts (Double Ticks) ────────────────────
  socket.on('message:delivery_ack', async ({ messageId, roomKey }) => {
    try {
      const result = await communityService.markDelivered(messageId, socket.user._id);
      if (result && roomKey) {
        io.to(roomKey).emit('message:deliveryUpdated', result);
      }
    } catch (_) {}
  });

  socket.on('message:read_ack', async ({ messageId, roomKey }) => {
    try {
      const result = await communityService.markMessageRead(messageId, socket.user._id);
      if (result && roomKey) {
        io.to(roomKey).emit('message:readUpdated', result);
      }
    } catch (_) {}
  });

  // ─── 5. Reactions, Pinned & Starred ─────────────────────────────────────────
  socket.on('chat:react', async ({ messageId, roomKey, emoji }) => {
    try {
      const reactions = await communityService.reactToMessage(messageId, socket.user._id, emoji);
      io.to(roomKey).emit('chat:reacted', { messageId, reactions });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  socket.on('chat:pin', async ({ messageId, roomKey, pin = true }) => {
    try {
      const message = await communityService.pinMessage(messageId, roomKey, pin);
      io.to(roomKey).emit('chat:pinned', { message, pin });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  socket.on('chat:star', async ({ messageId }) => {
    try {
      const result = await communityService.toggleStarMessage(messageId, socket.user._id);
      socket.emit('chat:starred', result);
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  // ─── 6. Typing Indicators ───────────────────────────────────────────────────
  socket.on('chat:typing', ({ roomKey }) => {
    socket.to(roomKey).emit('chat:typing', {
      roomKey,
      user: {
        _id: socket.user._id,
        fullName: socket.user.fullName,
        username: socket.user.username,
      },
    });
  });

  socket.on('chat:stopTyping', ({ roomKey }) => {
    socket.to(roomKey).emit('chat:stopTyping', { roomKey, userId: socket.user._id });
  });

  // ─── 7. Cursor-based Message History (Infinite Scroll) ──────────────────────
  socket.on('chat:history', async ({ roomKey, before, limit = 50 }) => {
    try {
      const messages = await communityService.getMessageHistory(roomKey, { before, limit });
      socket.emit('chat:history', { roomKey, messages, hasMore: messages.length >= limit });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  // ─── 8. Legacy Fallback (community:communityId room) ────────────────────────
  socket.on('chat:join', async ({ communityId }) => {
    try {
      const roomKey = `community:${communityId}`;
      socket.join(roomKey);

      await socketService.getOrCreateRoom({
        roomKey,
        type: 'community',
        referenceId: communityId,
        referenceModel: 'Community',
        createdBy: socket.user._id,
      });

      await socketService.addUserToRoom(roomKey, socket.user._id);

      const [history, users] = await Promise.all([
        communityService.getMessageHistory(roomKey, { limit: 50 }),
        socketService.getRoomUsers(roomKey),
      ]);

      socket.emit('chat:joined', { roomKey, users, history });
      socket.to(roomKey).emit('chat:userJoined', {
        user: {
          _id: socket.user._id,
          fullName: socket.user.fullName,
          username: socket.user.username,
          avatar: socket.user.avatar,
        },
      });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  socket.on('chat:message', async ({ communityId, content, replyTo }) => {
    try {
      if (!content?.trim()) return;
      const roomKey = `community:${communityId}`;
      const message = await communityService.saveMessage({
        senderId: socket.user._id,
        room: roomKey,
        communityId,
        content: content.trim(),
        replyTo,
      });

      io.to(roomKey).emit('chat:newMessage', { roomKey, message });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  socket.on('chat:leave', async ({ communityId }) => {
    const roomKey = `community:${communityId}`;
    socket.leave(roomKey);
    await socketService.removeUserFromRoom(roomKey, socket.user._id);
    socket.to(roomKey).emit('chat:userLeft', { userId: socket.user._id });
  });

  socket.on('chat:edit', async ({ messageId, roomKey, content }) => {
    try {
      const message = await communityService.editMessage(messageId, socket.user._id, content);
      io.to(roomKey).emit('chat:messageEdited', { message });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });

  socket.on('chat:delete', async ({ messageId, roomKey }) => {
    try {
      const message = await communityService.deleteMessage(messageId, socket.user._id, socket.user.role);
      io.to(roomKey).emit('chat:messageDeleted', { messageId: message._id });
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });
};

module.exports = { handleCommunity };
