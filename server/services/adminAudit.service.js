const AuditLog = require('../models/AuditLog');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get audit logs with filtering and pagination.
 */
const getAuditLogs = async (query = {}) => {
  const {
    page = 1,
    limit = 20,
    actor,
    module: mod,
    action,
    affectedUser,
    from,
    to,
  } = query;

  const filter = {};
  if (actor) filter.actor = actor;
  if (mod) filter.module = mod;
  if (action) filter.action = { $regex: action, $options: 'i' };
  if (affectedUser) filter.affectedUser = affectedUser;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate('actor', 'fullName email role')
      .populate('affectedUser', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Create an audit log entry.
 */
const createAuditLog = async (data) => {
  return AuditLog.create(data);
};

module.exports = { getAuditLogs, createAuditLog };
