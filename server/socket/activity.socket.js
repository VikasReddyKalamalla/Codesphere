const activityService = require('../services/activity.service');

/**
 * Activity feed handler — admin / dashboard use.
 *
 * Client events:
 *   activity:subscribe   { module? }  — join the activity feed room
 *   activity:unsubscribe —
 *   activity:getRecent   { module?, limit? }
 *
 * Server events emitted:
 *   activity:new    { log }   — broadcast to feed subscribers
 *   activity:recent { logs }
 */
const FEED_ROOM = 'activity:feed';

const handleActivity = (socket, io) => {
  socket.on('activity:subscribe', () => {
    // Only admins and instructors subscribe to the platform feed
    if (!['admin', 'instructor'].includes(socket.user.role)) return;
    socket.join(FEED_ROOM);
  });

  socket.on('activity:unsubscribe', () => {
    socket.leave(FEED_ROOM);
  });

  socket.on('activity:getRecent', async ({ module: mod, limit = 50 } = {}) => {
    if (!['admin', 'instructor'].includes(socket.user.role)) return;
    const logs = await activityService.getRecentActivity({ limit, module: mod });
    socket.emit('activity:recent', { logs });
  });
};

/**
 * Broadcast a new activity log entry to all feed subscribers.
 * Called from other socket handlers or REST services.
 */
const broadcastActivity = (io, log) => {
  io.to(FEED_ROOM).emit('activity:new', { log });
};

module.exports = { handleActivity, broadcastActivity };
