const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const learningService     = require('../services/learning.service');
const progressService     = require('../services/progress.service');

// GET /api/learning
const getAllPaths = asyncHandler(async (req, res) => {
  const data = await learningService.getAllPaths(req.query);
  return successResponse(res, 200, 'Learning paths fetched successfully', data);
});

// GET /api/learning/:id
const getPathById = asyncHandler(async (req, res) => {
  const data = await learningService.getPathById(req.params.id);
  return successResponse(res, 200, 'Learning path fetched successfully', data);
});

// POST /api/learning
const createPath = asyncHandler(async (req, res) => {
  const data = await learningService.createPath(req.body, req.user._id);
  return successResponse(res, 201, 'Learning path created successfully', data);
});

// PUT /api/learning/:id
const updatePath = asyncHandler(async (req, res) => {
  const data = await learningService.updatePath(req.params.id, req.body, req.user._id);
  return successResponse(res, 200, 'Learning path updated successfully', data);
});

// DELETE /api/learning/:id
const deletePath = asyncHandler(async (req, res) => {
  await learningService.deletePath(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Learning path deleted successfully');
});

// POST /api/learning/progress
const markProgress = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { lessonId, unmark, pathId, learningPathId } = req.body;
  const data = await progressService.markLessonComplete(userId, lessonId, unmark, pathId || learningPathId);
  const msg = unmark ? 'Lesson marked as incomplete' : 'Lesson marked as completed';
  return successResponse(res, 200, msg, data);
});

// GET /api/learning/progress/:learningPathId
const getProgress = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const data = await progressService.getProgress(userId, req.params.learningPathId);
  return successResponse(res, 200, 'Progress fetched successfully', data);
});

// GET /api/learning/progress
const getAllProgress = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const data = await progressService.getAllProgress(userId);
  return successResponse(res, 200, 'All progress fetched successfully', data);
});

// POST /api/learning/:id/enroll — enrol user in a learning path
const enroll = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const data = await progressService.enroll(userId, req.params.id);
  return successResponse(res, 200, 'Enrolled successfully', data);
});

// DELETE /api/learning/:id/enroll — unenrol user
const unenroll = asyncHandler(async (req, res) => {
  const data = await progressService.unenroll(req.user._id, req.params.id);
  return successResponse(res, 200, 'Unenrolled successfully', data);
});

module.exports = { getAllPaths, getPathById, createPath, updatePath, deletePath, markProgress, getProgress, getAllProgress, enroll, unenroll };
