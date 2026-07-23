const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const dashboardService    = require('../services/dashboard.service');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard
// Returns the complete dashboard in one response
// ─────────────────────────────────────────────────────────────────────────────
const getFullDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getFullDashboard(req.user._id);
  return successResponse(res, 200, 'Dashboard fetched successfully', data);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard/stats
// Returns only the statistics cards
// ─────────────────────────────────────────────────────────────────────────────
const getStats = asyncHandler(async (req, res) => {
  const data = await dashboardService.getStats(req.user._id);
  return successResponse(res, 200, 'Dashboard stats fetched successfully', data);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard/continue-learning
// Returns in-progress learning paths for the user
// ─────────────────────────────────────────────────────────────────────────────
const getContinueLearning = asyncHandler(async (req, res) => {
  const data = await dashboardService.getContinueLearning(req.user._id);
  return successResponse(res, 200, 'Continue learning data fetched successfully', data);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard/upcoming-sessions
// Returns upcoming sessions the user has joined
// ─────────────────────────────────────────────────────────────────────────────
const getUpcomingSessions = asyncHandler(async (req, res) => {
  const data = await dashboardService.getUpcomingSessions(req.user._id);
  return successResponse(res, 200, 'Upcoming sessions fetched successfully', data);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard/events
// Returns events the user has registered for
// ─────────────────────────────────────────────────────────────────────────────
const getRegisteredEvents = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRegisteredEvents(req.user._id);
  return successResponse(res, 200, 'Registered events fetched successfully', data);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard/resources
// Returns bookmarked/saved resources
// ─────────────────────────────────────────────────────────────────────────────
const getSavedResources = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSavedResources(req.user._id);
  return successResponse(res, 200, 'Saved resources fetched successfully', data);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard/notifications
// Returns latest notifications with unread count
// ─────────────────────────────────────────────────────────────────────────────
const getNotifications = asyncHandler(async (req, res) => {
  const data = await dashboardService.getNotifications(req.user._id);
  return successResponse(res, 200, 'Notifications fetched successfully', data);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard/achievements
// Returns streak, points, badges, certificates
// ─────────────────────────────────────────────────────────────────────────────
const getAchievements = asyncHandler(async (req, res) => {
  const data = await dashboardService.getAchievements(req.user._id);
  return successResponse(res, 200, 'Achievements fetched successfully', data);
});

module.exports = {
  getFullDashboard,
  getStats,
  getContinueLearning,
  getUpcomingSessions,
  getRegisteredEvents,
  getSavedResources,
  getNotifications,
  getAchievements,
};
