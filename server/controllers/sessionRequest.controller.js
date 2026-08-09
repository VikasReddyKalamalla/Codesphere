const SessionRequest = require('../models/SessionRequest');
const LiveSession = require('../models/LiveSession');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

// @desc    Create a session request
// @route   POST /api/sessions/requests
// @access  Private
const createSessionRequest = asyncHandler(async (req, res) => {
  const { title, description, agenda, proposedTime } = req.body;

  if (!title || !description || !proposedTime) {
    throw Object.assign(new Error('Please provide title, description, and proposed time'), { statusCode: 400 });
  }

  const request = await SessionRequest.create({
    requestedBy: req.user._id,
    title,
    description,
    agenda,
    proposedTime,
  });

  return successResponse(res, 201, 'Session request submitted successfully', request);
});

// @desc    Get all session requests (Admin)
// @route   GET /api/sessions/requests
// @access  Private/Admin
const getSessionRequests = asyncHandler(async (req, res) => {
  const requests = await SessionRequest.find()
    .populate('requestedBy', 'fullName username avatar')
    .sort('-createdAt');
  return successResponse(res, 200, 'Session requests fetched', requests);
});

// @desc    Approve/Reject a session request
// @route   PUT /api/sessions/requests/:id
// @access  Private/Admin
const updateSessionRequestStatus = asyncHandler(async (req, res) => {
  const { status, meetingLink, adminNotes } = req.body;
  const request = await SessionRequest.findById(req.params.id).populate('requestedBy');

  if (!request) {
    throw Object.assign(new Error('Session request not found'), { statusCode: 404 });
  }

  request.status = status;
  request.adminNotes = adminNotes || '';

  if (status === 'approved' && meetingLink) {
    // Automatically create a LiveSession hosted by the user who requested it
    const newSession = await LiveSession.create({
      title: request.title,
      description: request.description,
      agenda: request.agenda,
      startTime: request.proposedTime,
      endTime: new Date(new Date(request.proposedTime).getTime() + 60 * 60 * 1000), // 1 hour later
      host: request.requestedBy._id,
      meetingLink: meetingLink,
      status: 'upcoming',
      isPublished: true,
    });
    request.liveSessionId = newSession._id;
  }

  await request.save();

  return successResponse(res, 200, `Session request ${status}`, request);
});

module.exports = {
  createSessionRequest,
  getSessionRequests,
  updateSessionRequestStatus,
};
