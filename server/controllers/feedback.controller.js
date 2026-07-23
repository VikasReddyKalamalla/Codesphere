const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const feedbackService       = require('../services/feedback.service');

// POST /api/sessions/:id/feedback
const submitFeedback = asyncHandler(async (req, res) => {
  const data = await feedbackService.submitFeedback(req.params.id, req.user._id, req.body);
  return successResponse(res, 201, 'Feedback submitted successfully', data);
});

// GET /api/sessions/:id/feedback
const getFeedback = asyncHandler(async (req, res) => {
  const data = await feedbackService.getFeedback(req.params.id, req.user._id);
  return successResponse(res, 200, 'Feedback fetched successfully', data);
});

module.exports = { submitFeedback, getFeedback };
