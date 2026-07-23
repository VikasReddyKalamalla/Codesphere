const Notification = require('../models/Notification');
const NotificationLog = require('../models/NotificationLog');
const NotificationPreference = require('../models/NotificationPreference');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Create a single notification for a recipient.
 * Respects the user's notification preferences before persisting.
 */
const createNotification = async (data) => {
  const {
    recipient,
    title,
    message,
    category,
    priority = 'Medium',
    type = 'Information',
    icon,
    referenceId,
    referenceModule,
    templateId,
    metadata,
  } = data;

  // Check preferences – skip delivery if category is disabled
  const prefs = await NotificationPreference.findOne({ user: recipient });
  if (prefs) {
    if (!prefs.enabled) return null;
    if (prefs.categories && prefs.categories[category] === false) return null;
  }

  const notification = await Notification.create({
    recipient,
    title,
    message,
    category,
    priority,
    type,
    icon,
    referenceId,
    referenceModule,
    templateId,
    metadata,
  });

  // Write a delivery log
  await NotificationLog.create({
    notification: notification._id,
    recipient,
    deliveryStatus: 'Delivered',
    deliveryChannel: 'In-App',
    readStatus: 'Unread',
  });

  return notification;
};

/**
 * Retrieve a paginated list of notifications for the authenticated user.
 * Supports filtering by status, category, priority and keyword search.
 */
const getUserNotifications = async (userId, query = {}) => {
  const {
    page = 1,
    limit = 20,
    status,
    category,
    priority,
    type,
    search,
    sort = 'newest',
  } = query;

  const filter = {
    recipient: userId,
    status: { $ne: 'Deleted' },
  };

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (type) filter.type = type;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort(sortOrder)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Notification.countDocuments(filter),
  ]);

  return {
    notifications,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Retrieve a single notification by ID – only the owner may access it.
 */
const getNotificationById = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
    status: { $ne: 'Deleted' },
  });

  if (!notification) {
    throw createError('Notification not found', 404);
  }

  return notification;
};

/**
 * Mark a single notification as read.
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
    status: { $ne: 'Deleted' },
  });

  if (!notification) {
    throw createError('Notification not found', 404);
  }

  if (notification.status === 'Read') {
    return notification;
  }

  notification.status = 'Read';
  notification.readAt = new Date();
  await notification.save();

  // Update delivery log
  await NotificationLog.findOneAndUpdate(
    { notification: notificationId, recipient: userId },
    { readStatus: 'Read', readAt: notification.readAt }
  );

  return notification;
};

/**
 * Mark a single notification as unread.
 */
const markAsUnread = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
    status: { $ne: 'Deleted' },
  });

  if (!notification) {
    throw createError('Notification not found', 404);
  }

  notification.status = 'Unread';
  notification.readAt = null;
  await notification.save();

  await NotificationLog.findOneAndUpdate(
    { notification: notificationId, recipient: userId },
    { readStatus: 'Unread', readAt: null }
  );

  return notification;
};

/**
 * Soft-delete a single notification.
 */
const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
    status: { $ne: 'Deleted' },
  });

  if (!notification) {
    throw createError('Notification not found', 404);
  }

  notification.status = 'Deleted';
  await notification.save();

  return { message: 'Notification deleted successfully' };
};

/**
 * Clear all notifications (soft-delete) for the authenticated user.
 * Optionally restrict to a specific status filter.
 */
const clearAllNotifications = async (userId, statusFilter) => {
  const filter = { recipient: userId, status: { $ne: 'Deleted' } };
  if (statusFilter) filter.status = statusFilter;

  const result = await Notification.updateMany(filter, {
    status: 'Deleted',
  });

  return {
    message: 'Notifications cleared successfully',
    deletedCount: result.modifiedCount,
  };
};

/**
 * Return the count of unread notifications for a user.
 */
const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({
    recipient: userId,
    status: 'Unread',
  });

  return { unreadCount: count };
};

/**
 * Mark all unread notifications as read for a user.
 */
const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { recipient: userId, status: 'Unread' },
    { status: 'Read', readAt: new Date() }
  );

  await NotificationLog.updateMany(
    { recipient: userId, readStatus: 'Unread' },
    { readStatus: 'Read', readAt: new Date() }
  );

  return {
    message: 'All notifications marked as read',
    updatedCount: result.modifiedCount,
  };
};

/**
 * Generate notification statistics for a user.
 */
const getNotificationStats = async (userId) => {
  const [statusStats, categoryStats, priorityStats] = await Promise.all([
    Notification.aggregate([
      { $match: { recipient: userId, status: { $ne: 'Deleted' } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Notification.aggregate([
      { $match: { recipient: userId, status: { $ne: 'Deleted' } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
    Notification.aggregate([
      { $match: { recipient: userId, status: { $ne: 'Deleted' } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
  ]);

  const formatStats = (arr) =>
    arr.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

  return {
    byStatus: formatStats(statusStats),
    byCategory: formatStats(categoryStats),
    byPriority: formatStats(priorityStats),
  };
};

module.exports = {
  createNotification,
  getUserNotifications,
  getNotificationById,
  markAsRead,
  markAsUnread,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
  markAllAsRead,
  getNotificationStats,
};
