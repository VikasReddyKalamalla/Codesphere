const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const reportService = require('../services/adminReport.service');
const { getIO } = require('../socket/socket');

const emitReportChange = (action, report) => {
  try {
    getIO().emit('report_changed', { action, report, timestamp: Date.now() });
  } catch (err) {
    // Ignore socket error if disconnected
  }
};

const getReports = asyncHandler(async (req, res) => {
  const result = await reportService.getReports(req.query);
  successResponse(res, 200, 'Reports fetched', result);
});

const getReportById = asyncHandler(async (req, res) => {
  const report = await reportService.getReportById(req.params.id);
  successResponse(res, 200, 'Report fetched', { report });
});

const createReport = asyncHandler(async (req, res) => {
  const report = await reportService.createReport(req.body, req.user._id);
  emitReportChange('created', report);
  successResponse(res, 201, 'Report created', { report });
});

const updateReport = asyncHandler(async (req, res) => {
  const report = await reportService.updateReport(req.params.id, req.body, req.user._id);
  emitReportChange('updated', report);
  successResponse(res, 200, 'Report updated', { report });
});

const deleteReport = asyncHandler(async (req, res) => {
  const result = await reportService.deleteReport(req.params.id, req.user._id);
  emitReportChange('deleted', { _id: req.params.id });
  successResponse(res, 200, result.message, {});
});

module.exports = { getReports, getReportById, createReport, updateReport, deleteReport };
