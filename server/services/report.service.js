const Report = require('../models/Report');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── CREATE REPORT ────────────────────────────────────────────────────────────
const createReport = async (body, userId) => {
  const { targetType, targetId, reason, description } = body;

  if (!targetType) throw createError('Target type is required', 400);
  if (!targetId)   throw createError('Target ID is required', 400);
  if (!reason)     throw createError('Reason is required', 400);

  // Map targetType to targetModel
  const targetModel = targetType === 'post' ? 'Post' : targetType === 'comment' ? 'Comment' : 'Community';

  return Report.create({ reportedBy: userId, targetType, targetId, targetModel, reason, description, status: 'pending' });
};

// ─── GET ALL REPORTS (admin only) ─────────────────────────────────────────────
const getAllReports = async ({ status }) => {
  const filter = {};
  if (status) filter.status = status;

  return Report.find(filter)
    .populate('reportedBy', 'fullName avatar')
    .populate('reviewedBy',  'fullName')
    .sort({ createdAt: -1 });
};

// ─── UPDATE REPORT STATUS (admin only) ────────────────────────────────────────
const updateReportStatus = async (id, status, userId) => {
  const report = await Report.findById(id);
  if (!report) throw createError('Report not found', 404);

  report.status     = status;
  report.reviewedBy = userId;
  report.reviewedAt = new Date();
  await report.save();

  return report;
};

module.exports = { createReport, getAllReports, updateReportStatus };
