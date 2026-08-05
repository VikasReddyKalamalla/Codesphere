const mongoose = require('mongoose');
const AnnouncementNotification = require('../models/AnnouncementNotification');
const Notification = require('../models/Notification');
const NotificationLog = require('../models/NotificationLog');
const NotificationPreference = require('../models/NotificationPreference');
const User = require('../models/User');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Auto-seed initial official CodeSphere announcements if collection is empty
 */
const ensureInitialAnnouncements = async (adminUserId) => {
  const count = await AnnouncementNotification.countDocuments();
  if (count === 0) {
    let admin = adminUserId;
    if (!admin) {
      const adminUser = await User.findOne({ role: 'admin' });
      admin = adminUser ? adminUser._id : new mongoose.Types.ObjectId();
    }

    await AnnouncementNotification.create([
      {
        title: '🚀 CodeSphere v2.4 Platform Release — Cloud Compiler Sandboxes & Live Sessions',
        message: 'We are excited to announce CodeSphere v2.4! Packed with real-time cloud compiler sandboxes for Node.js, Python, C++, and Java, collaborative team workspaces, and live video lecture masterclasses.',
        category: 'Release',
        priority: 'High',
        targetAudience: 'All',
        isPinned: true,
        likesCount: 142,
        repostsCount: 38,
        viewsCount: 1840,
        status: 'Sent',
        mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
        createdBy: admin,
        sentAt: new Date(),
      },
      {
        title: '📢 Real-Time AI Code Assistant & Collaborative Workspaces Active',
        message: 'Collaborate seamlessly with your team in CodeSphere Workspaces. Built-in pair programming tools, integrated terminal outputs, and real-time cursor sync are now enabled for all platform members.',
        category: 'Update',
        priority: 'Medium',
        targetAudience: 'All',
        isPinned: false,
        likesCount: 89,
        repostsCount: 19,
        viewsCount: 920,
        status: 'Sent',
        createdBy: admin,
        sentAt: new Date(Date.now() - 3600000 * 24),
      },
      {
        title: '⚡ Scheduled Infrastructure Maintenance & Database Optimization',
        message: 'Our engineering team will conduct scheduled database optimizations and regional node upgrades on Sunday at 02:00 UTC. Expected downtime: < 5 minutes.',
        category: 'Maintenance',
        priority: 'Medium',
        targetAudience: 'All',
        isPinned: false,
        likesCount: 45,
        repostsCount: 7,
        viewsCount: 650,
        status: 'Sent',
        createdBy: admin,
        sentAt: new Date(Date.now() - 3600000 * 48),
      },
    ]);
  }
};

/**
 * Create a new announcement (published immediately as Sent by default).
 */
const createAnnouncement = async (data, userId) => {
  const announcement = await AnnouncementNotification.create({
    ...data,
    status: data.status || (data.scheduledAt ? 'Scheduled' : 'Sent'),
    sentAt: data.scheduledAt ? null : new Date(),
    createdBy: userId,
  });

  const populated = await AnnouncementNotification.findById(announcement._id)
    .populate('createdBy', 'fullName email role avatar')
    .lean();

  return populated;
};

/**
 * Get all announcements with pagination and filtering (pinned items first).
 */
const getAllAnnouncements = async (query = {}) => {
  await ensureInitialAnnouncements(query.userId);

  const { page = 1, limit = 30, status, targetAudience, category, search } = query;

  const filter = {};
  if (status) filter.status = status;
  if (targetAudience) filter.targetAudience = targetAudience;
  if (category && category !== 'all') filter.category = category;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [announcements, total] = await Promise.all([
    AnnouncementNotification.find(filter)
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'fullName email role avatar')
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
    .populate('createdBy updatedBy', 'fullName email role avatar')
    .populate('notificationIds');

  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  // Increment views count on read
  announcement.viewsCount = (announcement.viewsCount || 0) + 1;
  await announcement.save();

  return announcement;
};

/**
 * Update an announcement.
 */
const updateAnnouncement = async (announcementId, data, userId) => {
  const announcement = await AnnouncementNotification.findById(announcementId);

  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  Object.assign(announcement, { ...data, updatedBy: userId });
  await announcement.save();

  const updated = await AnnouncementNotification.findById(announcementId)
    .populate('createdBy', 'fullName email role avatar')
    .lean();

  return updated;
};

/**
 * Toggle Pin Status for an announcement.
 */
const togglePinAnnouncement = async (announcementId) => {
  const announcement = await AnnouncementNotification.findById(announcementId);

  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  announcement.isPinned = !announcement.isPinned;
  await announcement.save();

  const updated = await AnnouncementNotification.findById(announcementId)
    .populate('createdBy', 'fullName email role avatar')
    .lean();

  return updated;
};

/**
 * Like an announcement.
 */
const likeAnnouncement = async (announcementId) => {
  const announcement = await AnnouncementNotification.findById(announcementId);

  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  announcement.likesCount = (announcement.likesCount || 0) + 1;
  await announcement.save();

  const updated = await AnnouncementNotification.findById(announcementId)
    .populate('createdBy', 'fullName email role avatar')
    .lean();

  return updated;
};

/**
 * Repost an announcement.
 */
const repostAnnouncement = async (announcementId) => {
  const announcement = await AnnouncementNotification.findById(announcementId);

  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  announcement.repostsCount = (announcement.repostsCount || 0) + 1;
  await announcement.save();

  const updated = await AnnouncementNotification.findById(announcementId)
    .populate('createdBy', 'fullName email role avatar')
    .lean();

  return updated;
};

/**
 * Delete an announcement.
 */
const deleteAnnouncement = async (announcementId) => {
  const announcement = await AnnouncementNotification.findById(announcementId);

  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  await AnnouncementNotification.findByIdAndDelete(announcementId);

  return { message: 'Announcement deleted successfully' };
};

/**
 * Broadcast an announcement to the target audience.
 */
const broadcastAnnouncement = async (announcementId, userId) => {
  const announcement = await AnnouncementNotification.findById(announcementId);

  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  const userFilter = {};
  if (announcement.targetAudience === 'Instructors') {
    userFilter.role = 'instructor';
  } else if (announcement.targetAudience === 'Students') {
    userFilter.role = 'student';
  }

  const users = await User.find(userFilter).select('_id').lean();

  if (users.length === 0) {
    return { message: 'Announcement marked as broadcasted', recipientCount: 0, announcement };
  }

  const optedOutUsers = await NotificationPreference.find({
    user: { $in: users.map((u) => u._id) },
    $or: [{ enabled: false }, { announcements: false }],
  }).select('user');

  const optedOutIds = new Set(optedOutUsers.map((p) => p.user.toString()));
  const eligibleUsers = users.filter((u) => !optedOutIds.has(u._id.toString()));

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
  togglePinAnnouncement,
  likeAnnouncement,
  repostAnnouncement,
  deleteAnnouncement,
  broadcastAnnouncement,
};
