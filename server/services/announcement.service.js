const AnnouncementNotification = require('../models/AnnouncementNotification');
const Notification = require('../models/Notification');
const NotificationLog = require('../models/NotificationLog');
const NotificationPreference = require('../models/NotificationPreference');
const User = require('../models/User');
const createError = (message, statusCode) => { const err = new Error(message); err.statusCode = statusCode; return err; };

/**
 * Create a new announcement (saves as Draft by default).
 */
const createAnnouncement = async (data, userId) => {
  const announcement = await AnnouncementNotification.create({
    ...data,
    status: data.scheduledAt ? 'Scheduled' : 'Draft',
    createdBy: userId,
  });

  return announcement;
};

/**
 * Get all announcements with pagination and filtering.
 */
const getAllAnnouncements = async (query = {}) => {
  const { page = 1, limit = 20, status, targetAudience, search } = query;

  const filter = {};
  if (status) filter.status = status;
  if (targetAudience) filter.targetAudience = targetAudience;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [announcements, total] = await Promise.all([
    AnnouncementNotification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'name email')
      .lean(),
    AnnouncementNotification.countDocuments(filter),
  ]);

  return {
    announcements,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get a single announcement by ID.
 */
const getAnnouncementById = async (announcementId) => {
  const announcement = await AnnouncementNotification.findById(announcementId)
    .populate('createdBy updatedBy', 'name email')
    .populate('notificationIds');

  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  return announcement;
};

/**
 * Update an announcement (only allowed when Draft or Scheduled).
 */
const updateAnnouncement = async (announcementId, data, userId) => {
  const announcement = await AnnouncementNotification.findById(announcementId);

  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  if (!['Draft', 'Scheduled'].includes(announcement.status)) {
    throw createError('Only Draft or Scheduled announcements can be updated', 400);
  }

  if (data.scheduledAt && new Date(data.scheduledAt) <= new Date()) {
    throw createError('Scheduled time must be in the future', 400);
  }

  Object.assign(announcement, { ...data, updatedBy: userId });

  // Recalculate status if scheduledAt changes
  if (data.scheduledAt) {
    announcement.status = 'Scheduled';
  } else if (!announcement.scheduledAt) {
    announcement.status = 'Draft';
  }

  await announcement.save();

  return announcement;
};

/**
 * Delete an announcement (only Draft or Scheduled).
 */
const deleteAnnouncement = async (announcementId) => {
  const announcement = await AnnouncementNotification.findById(announcementId);

  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  if (!['Draft', 'Scheduled', 'Cancelled'].includes(announcement.status)) {
    throw createError('Sent announcements cannot be deleted', 400);
  }

  await AnnouncementNotification.findByIdAndDelete(announcementId);

  return { message: 'Announcement deleted successfully' };
};

/**
 * Broadcast an announcement to the target audience.
 * Builds individual Notification documents for each matching user.
 * Respects each user's announcement preference.
 */
const broadcastAnnouncement = async (announcementId, userId) => {
  const announcement = await AnnouncementNotification.findById(announcementId);

  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  if (announcement.status === 'Sent') {
    throw createError('Announcement has already been sent', 400);
  }

  if (announcement.status === 'Cancelled') {
    throw createError('Cancelled announcements cannot be sent', 400);
  }

  // Build user query based on targetAudience
  const userFilter = {};
  if (announcement.targetAudience === 'Instructors') {
    userFilter.role = 'instructor';
  } else if (announcement.targetAudience === 'Students') {
    userFilter.role = 'student';
  }

  const users = await User.find(userFilter).select('_id').lean();

  if (users.length === 0) {
    throw createError('No users found for the target audience', 404);
  }

  // Filter out users who have opted out of announcements
  const optedOutUsers = await NotificationPreference.find({
    user: { $in: users.map((u) => u._id) },
    $or: [{ enabled: false }, { announcements: false }],
  }).select('user');

  const optedOutIds = new Set(optedOutUsers.map((p) => p.user.toString()));
  const eligibleUsers = users.filter((u) => !optedOutIds.has(u._id.toString()));

  if (eligibleUsers.length === 0) {
    throw createError('All target users have opted out of announcements', 400);
  }

  // Bulk-create notifications
  const notificationDocs = eligibleUsers.map((u) => ({
    recipient: u._id,
    title: announcement.title,
    message: announcement.message,
    category: 'Admin',
    priority: announcement.priority,
    type: 'Announcement',
    icon: announcement.icon,
    referenceId: announcement._id,
    referenceModule: 'Announcement',
    status: 'Unread',
  }));

  const notifications = await Notification.insertMany(notificationDocs);

  // Bulk-create delivery logs
  const logDocs = notifications.map((n) => ({
    notification: n._id,
    recipient: n.recipient,
    deliveryStatus: 'Delivered',
    deliveryChannel: 'In-App',
    readStatus: 'Unread',
  }));

  await NotificationLog.insertMany(logDocs);

  // Update announcement document
  announcement.status = 'Sent';
  announcement.sentAt = new Date();
  announcement.recipientCount = notifications.length;
  announcement.notificationIds = notifications.map((n) => n._id);
  announcement.updatedBy = userId;
  await announcement.save();

  return {
    message: 'Announcement broadcast successfully',
    recipientCount: notifications.length,
    announcement,
  };
};

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  broadcastAnnouncement,
};
