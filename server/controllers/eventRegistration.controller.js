const asyncHandler              = require('../utils/asyncHandler');
const { successResponse }       = require('../utils/apiResponse');
const eventRegistrationService  = require('../services/eventRegistration.service');

// POST /api/events/:id/register
const registerForEvent = asyncHandler(async (req, res) => {
  const data = await eventRegistrationService.registerForEvent(req.params.id, req.user._id);
  return successResponse(res, 201, 'Registered successfully', data);
});

// DELETE /api/events/:id/register
const cancelRegistration = asyncHandler(async (req, res) => {
  const data = await eventRegistrationService.cancelRegistration(req.params.id, req.user._id);
  return successResponse(res, 200, 'Registration cancelled successfully', data);
});

// GET /api/events/:id/registrations
const getEventRegistrations = asyncHandler(async (req, res) => {
  const data = await eventRegistrationService.getEventRegistrations(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Registrations fetched successfully', data);
});

// GET /api/events/my/registrations
const getUserRegistrations = asyncHandler(async (req, res) => {
  const data = await eventRegistrationService.getUserRegistrations(req.user._id);
  return successResponse(res, 200, 'Your registered events fetched successfully', data);
});

// GET /api/events/:id/registration-status
const checkRegistrationStatus = asyncHandler(async (req, res) => {
  const data = await eventRegistrationService.checkRegistrationStatus(req.params.id, req.user._id);
  return successResponse(res, 200, 'Registration status fetched successfully', data);
});

module.exports = {
  registerForEvent,
  cancelRegistration,
  getEventRegistrations,
  getUserRegistrations,
  checkRegistrationStatus,
};
