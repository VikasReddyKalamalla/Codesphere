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

const getRealtimeAnalytics = asyncHandler(async (req, res) => {
  const snapshot = await analyticsService.getRealtimeAnalytics(req.query);
  successResponse(res, 200, 'Realtime analytics snapshot fetched', snapshot);
});

const getAnalyticsEvents = asyncHandler(async (req, res) => {
  const result = await analyticsService.getAnalyticsEvents(req.query);
  successResponse(res, 200, 'Analytics events fetched', result);
});

const simulateTrafficEvent = asyncHandler(async (req, res) => {
  const category = req.body?.category || req.query?.category;
  const newEvent = await analyticsService.simulateTrafficEvent(category);
  successResponse(res, 200, 'Simulated realtime event generated', { event: newEvent });
});

const seedAnalyticsData = asyncHandler(async (req, res) => {
  const result = await analyticsService.seedAnalyticsData();
  successResponse(res, 200, 'Analytics seed data generated successfully', result);
});

module.exports = {
  getAnalytics,
  generateAnalytics,
  getRealtimeAnalytics,
  getAnalyticsEvents,
  simulateTrafficEvent,
  seedAnalyticsData,
};
