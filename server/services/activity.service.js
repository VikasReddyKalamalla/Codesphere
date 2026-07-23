const ActivityLog = require('../models/ActivityLog');

/**
 * Record a socket activity event.
 */
const log = async ({ userId, module, action, referenceId, referenceType, metadata, socketId }) => {
  try {
    await ActivityLog.create({
      user: userId,
      module: module || 'General',
      action,
      referenceId,
      referenceType,
      metadata,
      socketId,
    });
  } catch {
    // Activity logging is non-critical — swallow errors silently
  }
};

/**
 * Get recent activity feed for a user.
 */
const getUserActivity = async (userId, { limit = 20 } = {}) => {
  return ActivityLog.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .lean();
};

/**
 * Get the platform-wide recent activity feed (admin use).
 */
const getRecentActivity = async ({ limit = 50, module: mod } = {}) => {
  const filter = {};
  if (mod) filter.module = mod;

  return ActivityLog.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate('user', 'fullName username avatar')
    .lean();
};

module.exports = { log, getUserActivity, getRecentActivity };
