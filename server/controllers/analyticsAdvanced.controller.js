const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const analyticsService = require('../services/analyticsAdvanced.service');
const { restrictTo } = require('../middlewares/role.middleware');

/**
 * Get dashboard metrics
 * GET /api/analytics/dashboard
 */
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const { dateRange = 30 } = req.query;
  const metrics = await analyticsService.getDashboardMetrics(parseInt(dateRange));
  return successResponse(res, 200, 'Dashboard metrics retrieved', metrics);
});

/**
 * Get cohort analysis
 * GET /api/analytics/cohorts
 */
const getCohortAnalysis = asyncHandler(async (req, res) => {
  const cohortData = await analyticsService.getCohortAnalysis();
  return successResponse(res, 200, 'Cohort analysis retrieved', cohortData);
});

/**
 * Get revenue trends
 * GET /api/analytics/revenue
 */
const getRevenueTrends = asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;
  const trends = await analyticsService.getRevenueTrends(parseInt(months));
  return successResponse(res, 200, 'Revenue trends retrieved', trends);
});

/**
 * Get top performing courses
 * GET /api/analytics/top-courses
 */
const getTopCourses = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const topCourses = await analyticsService.getTopCourses(parseInt(limit));
  return successResponse(res, 200, 'Top courses retrieved', topCourses);
});

/**
 * Get user engagement metrics
 * GET /api/analytics/engagement
 */
const getUserEngagement = asyncHandler(async (req, res) => {
  const engagement = await analyticsService.getUserEngagement();
  return successResponse(res, 200, 'Engagement metrics retrieved', engagement);
});

/**
 * Generate comprehensive report
 * POST /api/analytics/report
 */
const generateReport = asyncHandler(async (req, res) => {
  const { reportType = 'full' } = req.body;

  if (!['full', 'dashboard', 'cohort', 'revenue', 'courses', 'engagement'].includes(reportType)) {
    return errorResponse(res, 400, 'Invalid report type');
  }

  const report = await analyticsService.generateReport(reportType);
  return successResponse(res, 200, 'Report generated', report);
});

module.exports = {
  getDashboardMetrics,
  getCohortAnalysis,
  getRevenueTrends,
  getTopCourses,
  getUserEngagement,
  generateReport,
};
