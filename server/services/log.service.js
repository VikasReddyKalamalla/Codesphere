const NotificationLog = require('../models/NotificationLog');
const createError = (message, statusCode) => { const err = new Error(message); err.statusCode = statusCode; return err; };

/**
 * Get notification logs with pagination and filtering.
 * Admins can view all logs; regular users see only their own.
 */
const getLogs = async (query = {}, requestingUser) => {
  const { page = 1, limit = 20, deliveryStatus, readStatus, recipient } = query;

  const filter = {};

  // Non-admins can only view their own logs
  if (requestingUser.role !== 'admin') {
    filter.recipient = requestingUser._id;
  } else if (recipient) {
    filter.recipient = recipient;
  }

  if (deliveryStatus) filter.deliveryStatus = deliveryStatus;
  if (readStatus) filter.readStatus = readStatus;

  const skip = (Number(page) - 1) * Number(limit);

  const [logs, total] = await Promise.all([
    NotificationLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('notification', 'title category type priority')
      .populate('recipient', 'name email')
      .lean(),
    NotificationLog.countDocuments(filter),
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
 * Get a single notification log entry by ID.
 * Regular users may only access their own logs.
 */
const getLogById = async (logId, requestingUser) => {
  const log = await NotificationLog.findById(logId)
    .populate('notification', 'title category type priority message')
    .populate('recipient', 'name email');

  if (!log) {
    throw createError('Log entry not found', 404);
  }

  if (
    requestingUser.role !== 'admin' &&
    log.recipient._id.toString() !== requestingUser._id.toString()
  ) {
    throw createError('Access denied', 403);
  }

  return log;
};

module.exports = {
  getLogs,
  getLogById,
};
