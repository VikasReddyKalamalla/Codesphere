const WorkspaceActivity = require('../models/WorkspaceActivity');
const { getPagination }  = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── LOG ACTIVITY (internal helper) ──────────────────────────────────────────
const log = async (workspaceId, userId, activityType, description = '', entityType = 'workspace', entityId = null) => {
  try {
    await WorkspaceActivity.create({ workspaceId, userId, activityType, description, entityType, entityId });
  } catch (_) {
    // Activity logging is non-critical — swallow errors so they never break main flows
  }
};

// ─── GET ACTIVITIES FOR WORKSPACE ────────────────────────────────────────────
const getActivities = async (workspaceId, { page = 1, limit = 20 }) => {
  const total = await WorkspaceActivity.countDocuments({ workspaceId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const activities = await WorkspaceActivity.find({ workspaceId })
    .populate('userId', 'fullName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, activities };
};

module.exports = { log, getActivities };
