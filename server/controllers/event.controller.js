const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const eventService        = require('../services/event.service');
const { broadcastDataChange } = require('../utils/realtimeBroadcast');

// GET /api/events
const getAllEvents = asyncHandler(async (req, res) => {
  const data = await eventService.getAllEvents(req.query);
  return successResponse(res, 200, 'Events fetched successfully', data);
});

// GET /api/events/:id
const getEventById = asyncHandler(async (req, res) => {
  const data = await eventService.getEventById(req.params.id);
  return successResponse(res, 200, 'Event fetched successfully', data);
});

// GET /api/events/slug/:slug
const getEventBySlug = asyncHandler(async (req, res) => {
  const data = await eventService.getEventBySlug(req.params.slug);
  return successResponse(res, 200, 'Event fetched successfully', data);
});

// POST /api/events
const createEvent = asyncHandler(async (req, res) => {
  const data = await eventService.createEvent(req.body, req.user._id);
  broadcastDataChange('event', 'created', data);
  return successResponse(res, 201, 'Event created successfully', data);
});

// PUT /api/events/:id
const updateEvent = asyncHandler(async (req, res) => {
  const data = await eventService.updateEvent(req.params.id, req.body, req.user._id, req.user.role);
  broadcastDataChange('event', 'updated', data);
  return successResponse(res, 200, 'Event updated successfully', data);
});

// DELETE /api/events/:id
const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id, req.user._id, req.user.role);
  broadcastDataChange('event', 'deleted', { id: req.params.id });
  return successResponse(res, 200, 'Event deleted successfully');
});

// PATCH /api/events/:id/publish
const publishEvent = asyncHandler(async (req, res) => {
  const data = await eventService.publishEvent(req.params.id, req.user._id, req.user.role);
  broadcastDataChange('event', 'published', data);
  return successResponse(res, 200, 'Event published successfully', data);
});

// PATCH /api/events/:id/cancel
const cancelEvent = asyncHandler(async (req, res) => {
  const data = await eventService.cancelEvent(req.params.id, req.user._id, req.user.role, req.body.reason);
  broadcastDataChange('event', 'cancelled', data);
  return successResponse(res, 200, 'Event cancelled successfully', data);
});

// PATCH /api/events/:id/reschedule
const rescheduleEvent = asyncHandler(async (req, res) => {
  const data = await eventService.rescheduleEvent(req.params.id, req.user._id, req.user.role, req.body);
  broadcastDataChange('event', 'rescheduled', data);
  return successResponse(res, 200, 'Event rescheduled successfully', data);
});

// GET /api/events/my/organized
const getMyEvents = asyncHandler(async (req, res) => {
  const data = await eventService.getMyEvents(req.user._id, req.query);
  return successResponse(res, 200, 'My events fetched successfully', data);
});

// GET /api/events/:id/analytics
const getEventAnalytics = asyncHandler(async (req, res) => {
  const data = await eventService.getEventAnalytics(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Event analytics fetched successfully', data);
});

// GET /api/events/globe/markers
const getGlobeEvents = asyncHandler(async (req, res) => {
  const data = await eventService.getGlobeEvents();
  return successResponse(res, 200, 'Globe events fetched successfully', data);
});

// GET /api/events/analytics/summary
const getEventAnalyticsSummary = asyncHandler(async (req, res) => {
  const data = await eventService.getEventAnalyticsSummary();
  return successResponse(res, 200, 'Event analytics summary fetched successfully', data);
});

// GET /api/events/ai/recommendations
const getAiRecommendations = asyncHandler(async (req, res) => {
  const data = await eventService.getAiRecommendations(req.query.tags?.split(','));
  return successResponse(res, 200, 'AI event recommendations fetched successfully', data);
});

// POST /api/events/:id/like
const toggleEventLike = asyncHandler(async (req, res) => {
  const data = await eventService.toggleEventLike(req.params.id, req.user?._id);
  return successResponse(res, 200, 'Event liked successfully', data);
});

module.exports = {
  getAllEvents,
  getEventById,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  cancelEvent,
  rescheduleEvent,
  getMyEvents,
  getEventAnalytics,
  getGlobeEvents,
  getEventAnalyticsSummary,
  getAiRecommendations,
  toggleEventLike,
};
