const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const reportService = require('../services/adminReport.service');

const getReports = asyncHandler(async (req, res) => {
  const result = await reportService.getReports(req.query);
  successResponse(res, 200, 'Reports fetched', result);
});

const getReportById = asyncHandler(async (req, res) => {
  const report = await reportService.getReportById(req.params.id);
  successResponse(res, 200, 'Report fetched', { report });
});

const updateReport = asyncHandler(async (req, res) => {
  const report = await reportService.updateReport(req.params.id, req.body, req.user._id);
  successResponse(res, 200, 'Report updated', { report });
});

module.exports = { getReports, getReportById, updateReport };
