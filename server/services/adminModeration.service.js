const ModerationQueue = require('../models/ModerationQueue');
const AdminLog = require('../models/AdminLog');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get the moderation queue with filtering and pagination.
 */
const getModerationQueue = async (query = {}) => {
  const { page = 1, limit = 20, status, contentType, priority, reason } = query;

  const filter = {};
  if (status) filter.status = status;
  if (contentType) filter.contentType = contentType;
  if (priority) filter.priority = priority;
  if (reason) filter.reason = reason;

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    ModerationQueue.find(filter)
      .populate('reportedBy', 'fullName email')
      .populate('contentOwner', 'fullName email')
      .populate('reviewedBy', 'fullName')
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    ModerationQueue.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Approve content in the moderation queue (keep it live, close the case).
 */
const approveContent = async (itemId, adminId, adminNotes) => {
  const item = await ModerationQueue.findById(itemId);
  if (!item) throw createError('Moderation item not found', 404);
  if (item.status !== 'pending') throw createError('Item already reviewed', 400);

  item.status = 'approved';
  item.reviewedBy = adminId;
  item.reviewedAt = new Date();
  item.adminNotes = adminNotes || '';
  await item.save();

  await AdminLog.create({
    admin: adminId,
    action: 'Content Approved',
    module: 'Moderation',
    affectedResourceId: item.contentId,
    affectedResourceType: item.contentType,
    details: { adminNotes },
  });

  return item;
};

/**
 * Reject (remove) content from the platform.
 */
const rejectContent = async (itemId, adminId, adminNotes) => {
  const item = await ModerationQueue.findById(itemId);
  if (!item) throw createError('Moderation item not found', 404);
  if (item.status !== 'pending') throw createError('Item already reviewed', 400);

  item.status = 'rejected';
  item.reviewedBy = adminId;
  item.reviewedAt = new Date();
  item.adminNotes = adminNotes || '';
  await item.save();

  // Attempt to soft-delete the content
  if (item.contentType === 'Post') {
    await Post.findByIdAndDelete(item.contentId);
  } else if (item.contentType === 'Comment') {
    await Comment.findByIdAndDelete(item.contentId);
  }

  await AdminLog.create({
    admin: adminId,
    action: 'Content Rejected and Removed',
    module: 'Moderation',
    affectedResourceId: item.contentId,
    affectedResourceType: item.contentType,
    details: { adminNotes },
  });

  return { message: 'Content rejected and removed from platform', item };
};

/**
 * Delete a moderation queue item directly.
 */
const deleteModerationItem = async (itemId, adminId) => {
  const item = await ModerationQueue.findByIdAndDelete(itemId);
  if (!item) throw createError('Moderation item not found', 404);

  await AdminLog.create({
    admin: adminId,
    action: 'Moderation Item Deleted',
    module: 'Moderation',
    affectedResourceId: itemId,
    affectedResourceType: 'ModerationQueue',
  });

  return { message: 'Moderation item deleted' };
};

/**
 * Create a moderation queue item from a submitted report.
 */
const createModerationItem = async (data) => {
  const item = await ModerationQueue.create(data);
  return item;
};

module.exports = {
  getModerationQueue,
  approveContent,
  rejectContent,
  deleteModerationItem,
  createModerationItem,
};
