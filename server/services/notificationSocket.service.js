const Notification = require('../models/Notification');

/**
 * Emit a notification to a specific user via their personal Socket.IO room.
 * Called from REST services after persisting notifications to MongoDB.
 *
 * Usage:
 *   const { emitToUser } = require('./notificationSocket.service');
 *   emitToUser(io, userId, notification);
 */
const emitToUser = (io, userId, notification) => {
  if (!io) return;
  io.to(`user:${userId.toString()}`).emit('notification:new', notification);
};

/**
 * Broadcast a notification to all connected users (for announcements).
 */
const broadcast = (io, notification) => {
  if (!io) return;
  io.emit('notification:announcement', notification);
};

/**
 * Emit unread count update to a specific user.
 */
const emitUnreadCount = async (io, userId) => {
  if (!io) return;
  const count = await Notification.countDocuments({ recipient: userId, status: 'Unread' });
  io.to(`user:${userId.toString()}`).emit('notification:unreadCount', { count });
};

module.exports = { emitToUser, broadcast, emitUnreadCount };
