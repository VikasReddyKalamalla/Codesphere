const Report = require('../models/Report');
const AdminLog = require('../models/AdminLog');
const User = require('../models/User');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get all reports with filtering, search, and pagination.
 */
const getReports = async (query = {}) => {
  const { page = 1, limit = 20, status, reason, targetType, priority, search } = query;

  const filter = {};
  if (status) filter.status = status;
  if (reason) filter.reason = reason;
  if (targetType) filter.targetType = targetType;
  if (priority) filter.priority = priority;

  if (search) {
    filter.$or = [
      { targetSummary: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { adminNotes: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [reports, total, pendingCount, criticalCount, resolvedCount] = await Promise.all([
    Report.find(filter)
      .populate('reportedBy', 'fullName email username avatar')
      .populate('reviewedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Report.countDocuments(filter),
    Report.countDocuments({ status: 'pending' }),
    Report.countDocuments({ priority: { $in: ['high', 'critical'] }, status: 'pending' }),
    Report.countDocuments({ status: 'resolved' }),
  ]);

  return {
    reports,
    stats: {
      total,
      pending: pendingCount,
      critical: criticalCount,
      resolved: resolvedCount,
    },
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

/**
 * Get a single report by ID.
 */
const getReportById = async (reportId) => {
  const report = await Report.findById(reportId)
    .populate('reportedBy', 'fullName email username avatar')
    .populate('reviewedBy', 'fullName email');

  if (!report) throw createError('Report not found', 404);
  return report;
};

/**
 * Create a new report (User or Admin).
 */
const createReport = async (data, reporterId) => {
  const report = await Report.create({
    ...data,
    reportedBy: reporterId,
  });

  return await Report.findById(report._id)
    .populate('reportedBy', 'fullName email username avatar')
    .lean();
};

/**
 * Update a report's status, action taken, priority, and admin notes.
 */
const updateReport = async (reportId, data, adminId) => {
  const { status, adminNotes, actionTaken, priority } = data;

  const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
  if (status && !validStatuses.includes(status)) {
    throw createError('Invalid status', 400);
  }

  const updateFields = {
    ...(status && { status }),
    ...(adminNotes !== undefined && { adminNotes }),
    ...(actionTaken && { actionTaken }),
    ...(priority && { priority }),
    reviewedBy: adminId,
    reviewedAt: new Date(),
  };

  const report = await Report.findByIdAndUpdate(reportId, updateFields, { new: true })
    .populate('reportedBy', 'fullName email username avatar')
    .populate('reviewedBy', 'fullName email');

  if (!report) throw createError('Report not found', 404);

  await AdminLog.create({
    admin: adminId,
    action: `Report ${status || 'Updated'}`,
    module: 'Reports',
    affectedResourceId: reportId,
    affectedResourceType: 'Report',
    details: data,
  });

  return report;
};

/**
 * Delete a report log.
 */
const deleteReport = async (reportId, adminId) => {
  const report = await Report.findById(reportId);
  if (!report) throw createError('Report not found', 404);

  await report.deleteOne();

  await AdminLog.create({
    admin: adminId,
    action: 'Report Deleted',
    module: 'Reports',
    affectedResourceId: reportId,
    affectedResourceType: 'Report',
  });

  return { message: 'Report deleted successfully' };
};

module.exports = { getReports, getReportById, createReport, updateReport, deleteReport };
