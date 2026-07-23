const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const liveSessionService    = require('../services/liveSession.service');

// GET /api/sessions
const getAllSessions = asyncHandler(async (req, res) => {
  const data = await liveSessionService.getAllSessions(req.query);
  return successResponse(res, 200, 'Sessions fetched successfully', data);
});

// GET /api/sessions/:id
const getSessionById = asyncHandler(async (req, res) => {
  const data = await liveSessionService.getSessionById(req.params.id);
  return successResponse(res, 200, 'Session fetched successfully', data);
});

// POST /api/sessions
const createSession = asyncHandler(async (req, res) => {
  const data = await liveSessionService.createSession(req.body, req.user._id);
  return successResponse(res, 201, 'Session created successfully', data);
});

// PUT /api/sessions/:id
const updateSession = asyncHandler(async (req, res) => {
  const data = await liveSessionService.updateSession(req.params.id, req.body, req.user._id, req.user.role);
  return successResponse(res, 200, 'Session updated successfully', data);
});

// DELETE /api/sessions/:id
const deleteSession = asyncHandler(async (req, res) => {
  await liveSessionService.deleteSession(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Session deleted successfully');
});

// PATCH /api/sessions/:id/publish
const publishSession = asyncHandler(async (req, res) => {
  const data = await liveSessionService.publishSession(req.params.id, req.user._id);
  return successResponse(res, 200, 'Session published successfully', data);
});

// PATCH /api/sessions/:id/cancel
const cancelSession = asyncHandler(async (req, res) => {
  const data = await liveSessionService.cancelSession(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Session cancelled successfully', data);
});

// PATCH /api/sessions/:id/go-live
const goLive = asyncHandler(async (req, res) => {
  const data = await liveSessionService.goLive(req.params.id, req.user._id);
  return successResponse(res, 200, 'Session is now live', data);
});

// PATCH /api/sessions/:id/end
const endSession = asyncHandler(async (req, res) => {
  const data = await liveSessionService.endSession(req.params.id, req.user._id);
  return successResponse(res, 200, 'Session ended successfully', data);
});

// GET /api/sessions/:id/analytics
const getSessionAnalytics = asyncHandler(async (req, res) => {
  const data = await liveSessionService.getSessionAnalytics(req.params.id, req.user._id);
  return successResponse(res, 200, 'Session analytics fetched successfully', data);
});

// POST /api/sessions/:id/duplicate
const duplicateSession = asyncHandler(async (req, res) => {
  const data = await liveSessionService.duplicateSession(req.params.id, req.user._id);
  return successResponse(res, 201, 'Session duplicated successfully', data);
});

// PATCH /api/sessions/:id/archive
const archiveSession = asyncHandler(async (req, res) => {
  const data = await liveSessionService.archiveSession(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Session archived successfully', data);
});

module.exports = {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  publishSession,
  cancelSession,
  goLive,
  endSession,
  getSessionAnalytics,
  duplicateSession,
  archiveSession,
};
