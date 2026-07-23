const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const registrationService   = require('../services/registration.service');

// POST /api/sessions/:id/register
const registerForSession = asyncHandler(async (req, res) => {
  const data = await registrationService.registerForSession(req.params.id, req.user._id);
  return successResponse(res, 201, 'Registered for session successfully', data);
});

// DELETE /api/sessions/:id/register
const cancelRegistration = asyncHandler(async (req, res) => {
  const data = await registrationService.cancelRegistration(req.params.id, req.user._id);
  return successResponse(res, 200, 'Registration cancelled successfully', data);
});

// GET /api/sessions/:id/registrations
const getRegistrations = asyncHandler(async (req, res) => {
  const data = await registrationService.getRegistrations(req.params.id, req.user._id);
  return successResponse(res, 200, 'Registrations fetched successfully', data);
});

// GET /api/sessions/my-sessions
const getUserRegistrations = asyncHandler(async (req, res) => {
  const data = await registrationService.getUserRegistrations(req.user._id);
  return successResponse(res, 200, 'Your registered sessions fetched successfully', data);
});

module.exports = { registerForSession, cancelRegistration, getRegistrations, getUserRegistrations };
