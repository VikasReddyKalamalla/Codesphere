const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const lessonService       = require('../services/lesson.service');

// GET /api/lessons/:moduleId
const getLessonsByModule = asyncHandler(async (req, res) => {
  const data = await lessonService.getLessonsByModule(req.params.moduleId);
  return successResponse(res, 200, 'Lessons fetched successfully', data);
});

// GET /api/lessons/single/:id
const getLessonById = asyncHandler(async (req, res) => {
  const data = await lessonService.getLessonById(req.params.id);
  return successResponse(res, 200, 'Lesson fetched successfully', data);
});

// POST /api/lessons
const createLesson = asyncHandler(async (req, res) => {
  const data = await lessonService.createLesson(req.body);
  return successResponse(res, 201, 'Lesson created successfully', data);
});

// PUT /api/lessons/:id
const updateLesson = asyncHandler(async (req, res) => {
  const data = await lessonService.updateLesson(req.params.id, req.body);
  return successResponse(res, 200, 'Lesson updated successfully', data);
});

// DELETE /api/lessons/:id
const deleteLesson = asyncHandler(async (req, res) => {
  await lessonService.deleteLesson(req.params.id);
  return successResponse(res, 200, 'Lesson deleted successfully');
});

module.exports = { getLessonsByModule, getLessonById, createLesson, updateLesson, deleteLesson };
