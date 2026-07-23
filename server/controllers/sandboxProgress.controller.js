const asyncHandler           = require('../utils/asyncHandler');
const { successResponse }    = require('../utils/apiResponse');
const sandboxProgressService = require('../services/sandboxProgress.service');

// GET /api/sandbox/:id/progress
const getProgress = asyncHandler(async (req, res) => {
  const data = await sandboxProgressService.getProgress(req.params.id, req.user._id);
  return successResponse(res, 200, 'Progress fetched successfully', data);
});

// POST /api/sandbox/:id/start
const startProject = asyncHandler(async (req, res) => {
  const data = await sandboxProgressService.startProject(req.params.id, req.user._id);
  return successResponse(res, 201, 'Project started successfully', data);
});

// PUT /api/sandbox/:id/progress
const updateProgress = asyncHandler(async (req, res) => {
  const data = await sandboxProgressService.updateProgress(req.params.id, req.user._id, req.body);
  return successResponse(res, 200, 'Progress updated successfully', data);
});

// POST /api/sandbox/:id/reset
const resetProgress = asyncHandler(async (req, res) => {
  const data = await sandboxProgressService.resetProgress(req.params.id, req.user._id);
  return successResponse(res, 200, 'Progress reset successfully', data);
});

// GET /api/sandbox/my/progress
const getMyProgress = asyncHandler(async (req, res) => {
  const data = await sandboxProgressService.getMyProgress(req.user._id, req.query);
  return successResponse(res, 200, 'Your progress fetched successfully', data);
});

module.exports = { getProgress, startProject, updateProgress, resetProgress, getMyProgress };
