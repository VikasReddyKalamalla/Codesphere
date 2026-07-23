const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const healthService = require('../services/adminHealth.service');

const getSystemHealth = asyncHandler(async (req, res) => {
  const snapshot = await healthService.getSystemHealth();
  successResponse(res, 200, 'System health fetched', snapshot);
});

const getHealthHistory = asyncHandler(async (req, res) => {
  const result = await healthService.getHealthHistory(req.query.limit);
  successResponse(res, 200, 'Health history fetched', result);
});

module.exports = { getSystemHealth, getHealthHistory };
