const notificationService = require('../services/notification.service');

/**
 * GET /api/notifications
 * Get paginated notifications for the authenticated user.
 */
const getNotifications = async (req, res) => {
  const result = await notificationService.getUserNotifications(req.user._id, req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
};

/**
 * GET /api/notifications/unread-count
 * Get unread notification count for the authenticated user.
 */
const getUnreadCount = async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user._id);

  res.status(200).json({
    success: true,
    ...result,
  });
};

/**
 * GET /api/notifications/stats
 * Get notification statistics for the authenticated user.
 */
const getNotificationStats = async (req, res) => {
  const stats = await notificationService.getNotificationStats(req.user._id);

  res.status(200).json({
    success: true,
    stats,
  });
};

/**
 * GET /api/notifications/:id
 * Get a single notification by ID.
 */
const getNotificationById = async (req, res) => {
  const notification = await notificationService.getNotificationById(
    req.params.id,
    req.user._id
  );

  res.status(200).json({
    success: true,
    notification,
  });
};

/**
 * POST /api/notifications
 * Create a notification (typically called by other services/admin).
 */
const createNotification = async (req, res) => {
  const notification = await notificationService.createNotification(req.body);

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    notification,
  });
};

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read.
 */
const markAsRead = async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    notification,
  });
};

/**
 * PUT /api/notifications/:id/unread
 * Mark a notification as unread.
 */
const markAsUnread = async (req, res) => {
  const notification = await notificationService.markAsUnread(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Notification marked as unread',
    notification,
  });
};

/**
 * PUT /api/notifications/mark-all-read
 * Mark all notifications as read for the authenticated user.
 */
const markAllAsRead = async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);

  res.status(200).json({
    success: true,
    ...result,
  });
};

/**
 * DELETE /api/notifications/:id
 * Soft-delete a single notification.
 */
const deleteNotification = async (req, res) => {
  const result = await notificationService.deleteNotification(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    ...result,
  });
};

/**
 * DELETE /api/notifications
 * Clear all notifications for the authenticated user.
 */
const clearAllNotifications = async (req, res) => {
  const result = await notificationService.clearAllNotifications(
    req.user._id,
    req.query.status
  );

  res.status(200).json({
    success: true,
    ...result,
  });
};

module.exports = {
  getNotifications,
  getUnreadCount,
  getNotificationStats,
  getNotificationById,
  createNotification,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};
