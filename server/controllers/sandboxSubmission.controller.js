const asyncHandler              = require('../utils/asyncHandler');
const { successResponse }       = require('../utils/apiResponse');
const sandboxSubmissionService  = require('../services/sandboxSubmission.service');

// POST /api/sandbox/:id/submission
const submitProject = asyncHandler(async (req, res) => {
  const data = await sandboxSubmissionService.submitProject(req.params.id, req.body, req.user._id);
  return successResponse(res, 201, 'Project submitted successfully', data);
});

// PUT /api/submissions/:id
const updateSubmission = asyncHandler(async (req, res) => {
  const data = await sandboxSubmissionService.updateSubmission(req.params.id, req.body, req.user._id);
  return successResponse(res, 200, 'Submission updated successfully', data);
});

// DELETE /api/submissions/:id
const deleteSubmission = asyncHandler(async (req, res) => {
  await sandboxSubmissionService.deleteSubmission(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Submission deleted successfully');
});

// GET /api/sandbox/:id/submissions
const getProjectSubmissions = asyncHandler(async (req, res) => {
  const data = await sandboxSubmissionService.getProjectSubmissions(req.params.id, req.user._id, req.user.role, req.query);
  return successResponse(res, 200, 'Submissions fetched successfully', data);
});

// GET /api/sandbox/my/submissions
const getMySubmissions = asyncHandler(async (req, res) => {
  const data = await sandboxSubmissionService.getMySubmissions(req.user._id);
  return successResponse(res, 200, 'Your submissions fetched successfully', data);
});

// PUT /api/submissions/:id/review
const reviewSubmission = asyncHandler(async (req, res) => {
  const data = await sandboxSubmissionService.reviewSubmission(req.params.id, req.body, req.user._id, req.user.role);
  return successResponse(res, 200, 'Submission reviewed successfully', data);
});

module.exports = {
  submitProject,
  updateSubmission,
  deleteSubmission,
  getProjectSubmissions,
  getMySubmissions,
  reviewSubmission,
};
