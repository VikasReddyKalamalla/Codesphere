const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const reportService       = require('../services/report.service');

// POST /api/reports
const createReport = asyncHandler(async (req, res) => {
  const data = await reportService.createReport(req.body, req.user._id);
  return successResponse(res, 201, 'Report submitted successfully', data);
});

// GET /api/reports  (admin only)
const getAllReports = asyncHandler(async (req, res) => {
  const data = await reportService.getAllReports(req.query);
  return successResponse(res, 200, 'Reports fetched successfully', data);
});

// PUT /api/reports/:id  (admin only)
const updateReportStatus = asyncHandler(async (req, res) => {
  const data = await reportService.updateReportStatus(req.params.id, req.body.status, req.user._id);
  return successResponse(res, 200, 'Report status updated successfully', data);
});

module.exports = { createReport, getAllReports, updateReportStatus };
