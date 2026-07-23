const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const analyticsService = require('../services/adminAnalytics.service');

const getAnalytics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getAnalytics(req.query);
  successResponse(res, 200, 'Analytics fetched', result);
});

const generateAnalytics = asyncHandler(async (req, res) => {
  const record = await analyticsService.generateAnalytics(req.user._id);
  successResponse(res, 200, 'Analytics generated', { analytics: record });
});

module.exports = { getAnalytics, generateAnalytics };
