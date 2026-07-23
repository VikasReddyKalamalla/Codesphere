const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const adminService = require('../services/admin.service');

/**
 * GET /api/admin/dashboard
 */
const getDashboard = asyncHandler(async (req, res) => {
  const data = await adminService.getDashboard();
  successResponse(res, 200, 'Dashboard data fetched', data);
});

/**
 * GET /api/admin/statistics
 */
const getStatistics = asyncHandler(async (req, res) => {
  const data = await adminService.getStatistics();
  successResponse(res, 200, 'Statistics fetched', data);
});

module.exports = { getDashboard, getStatistics };
