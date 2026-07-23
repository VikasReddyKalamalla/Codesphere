const presenceService = require('../services/presence.service');
const activityService = require('../services/activity.service');

/**
 * Attach presence and online-status event handlers.
 *
 * Client events:
 *   presence:setStatus   { status }   — 'online' | 'away' | 'busy'
 *   presence:getOnline   { userIds? } — request current online users
 *
 * Server events emitted:
 *   presence:online          { userId, user }   — broadcast on connect
 *   presence:offline         { userId }         — broadcast on disconnect
 *   presence:statusChanged   { userId, status }
 *   presence:onlineUsers     { users }
 */
const handlePresence = (socket, io) => {
  // ─── Status change ──────────────────────────────────────────────────────────
  socket.on('presence:setStatus', async ({ status }) => {
    const validStatuses = ['online', 'away', 'busy'];
    if (!validStatuses.includes(status)) return;

    await presenceService.updateStatus(socket.user._id, status);

    // Broadcast to everyone
    io.emit('presence:statusChanged', {
      userId: socket.user._id,
      status,
    });
  });

  // ─── Query online users ─────────────────────────────────────────────────────
  socket.on('presence:getOnline', async ({ userIds } = {}) => {
    const users = await presenceService.getOnlineUsers(userIds);
    socket.emit('presence:onlineUsers', { users });
  });
};

/**
 * Broadcast "user came online" — called from the main connection handler.
 */
const broadcastOnline = (io, user) => {
  io.emit('presence:online', {
    userId: user._id,
    user: {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      avatar: user.avatar,
    },
  });
};

/**
 * Broadcast "user went offline" — called from the disconnect handler.
 */
const broadcastOffline = (io, userId) => {
  io.emit('presence:offline', { userId });
};

module.exports = { handlePresence, broadcastOnline, broadcastOffline };
