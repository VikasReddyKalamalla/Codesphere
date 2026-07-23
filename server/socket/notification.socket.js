const notificationService = require('../services/notification.service');
const notificationSocketService = require('../services/notificationSocket.service');

/**
 * Attach notification event handlers.
 *
 * Client events:
 *   notification:join         — join user's personal room
 *   notification:markRead     { notificationId }
 *   notification:markAllRead  —
 *
 * Server events emitted:
 *   notification:new          { notification }
 *   notification:unreadCount  { count }
 *   notification:announcement { notification }
 *   notification:allRead      { updatedCount }
 *   notification:error        { message }
 */
const handleNotification = (socket, io) => {
  // ─── Join personal notification room ────────────────────────────────────────
  socket.on('notification:join', () => {
    const room = `user:${socket.user._id}`;
    socket.join(room);
  });

  // ─── Mark single notification as read ───────────────────────────────────────
  socket.on('notification:markRead', async ({ notificationId }) => {
    try {
      await notificationService.markAsRead(notificationId, socket.user._id);
      await notificationSocketService.emitUnreadCount(io, socket.user._id);
    } catch (err) {
      socket.emit('notification:error', { message: err.message });
    }
  });

  // ─── Mark all notifications as read ─────────────────────────────────────────
  socket.on('notification:markAllRead', async () => {
    try {
      const result = await notificationService.markAllAsRead(socket.user._id);
      socket.emit('notification:allRead', { updatedCount: result.updatedCount });
      await notificationSocketService.emitUnreadCount(io, socket.user._id);
    } catch (err) {
      socket.emit('notification:error', { message: err.message });
    }
  });
};

/**
 * Helper to push a new notification to a user from any server-side service.
 * Usage: emitNotification(io, userId, notificationDoc)
 */
const emitNotification = (io, userId, notification) => {
  notificationSocketService.emitToUser(io, userId, notification);
};

module.exports = { handleNotification, emitNotification };
