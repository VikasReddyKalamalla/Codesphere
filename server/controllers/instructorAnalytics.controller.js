const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const analyticsService = require('../services/instructorAnalytics.service');

/**
 * GET /api/instructor-analytics
 * Get monthly analytics history for the authenticated instructor.
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getAnalytics(req.user._id, req.query);
  successResponse(res, 200, 'Analytics fetched successfully', result);
});

/**
 * POST /api/instructor-analytics/generate
 * Generate (or refresh) the current-month analytics snapshot.
 */
const generateAnalytics = asyncHandler(async (req, res) => {
  const record = await analyticsService.generateCurrentMonthAnalytics(req.user._id);
  successResponse(res, 200, 'Analytics generated successfully', { analytics: record });
});

/**
 * GET /api/instructor-analytics/statistics
 * Get all-time aggregate statistics for the authenticated instructor.
 */
const getStatistics = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getInstructorStatistics(req.user._id);
  successResponse(res, 200, 'Statistics fetched successfully', { stats });
});

module.exports = {
  getAnalytics,
  generateAnalytics,
  getStatistics,
};
