const Report = require('../models/Report');
const AdminLog = require('../models/AdminLog');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get all reports with filtering and pagination.
 */
const getReports = async (query = {}) => {
  const { page = 1, limit = 20, status, reason, targetType, search } = query;

  const filter = {};
  if (status) filter.status = status;
  if (reason) filter.reason = reason;
  if (targetType) filter.targetType = targetType;

  const skip = (Number(page) - 1) * Number(limit);

  const [reports, total] = await Promise.all([
    Report.find(filter)
      .populate('reportedBy', 'fullName email')
      .populate('reviewedBy', 'fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Report.countDocuments(filter),
  ]);

  return {
    reports,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get a single report by ID.
 */
const getReportById = async (reportId) => {
  const report = await Report.findById(reportId)
    .populate('reportedBy', 'fullName email')
    .populate('reviewedBy', 'fullName');

  if (!report) throw createError('Report not found', 404);
  return report;
};

/**
 * Update a report's status (reviewed / resolved / dismissed).
 */
const updateReport = async (reportId, data, adminId) => {
  const { status, adminNotes } = data;

  const validStatuses = ['reviewed', 'resolved', 'dismissed'];
  if (status && !validStatuses.includes(status)) {
    throw createError('Invalid status', 400);
  }

  const report = await Report.findByIdAndUpdate(
    reportId,
    {
      ...(status && { status }),
      ...(adminNotes && { description: adminNotes }),
      reviewedBy: adminId,
      reviewedAt: new Date(),
    },
    { new: true }
  );

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

module.exports = { getReports, getReportById, updateReport };
