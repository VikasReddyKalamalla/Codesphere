const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const eventCategoryService  = require('../services/eventCategory.service');

// GET /api/event-categories
const getAllCategories = asyncHandler(async (req, res) => {
  const data = await eventCategoryService.getAllCategories();
  return successResponse(res, 200, 'Event categories fetched successfully', data);
});

// GET /api/event-categories/:id
const getCategoryById = asyncHandler(async (req, res) => {
  const data = await eventCategoryService.getCategoryById(req.params.id);
  return successResponse(res, 200, 'Event category fetched successfully', data);
});

// POST /api/event-categories
const createCategory = asyncHandler(async (req, res) => {
  const data = await eventCategoryService.createCategory(req.body);
  return successResponse(res, 201, 'Event category created successfully', data);
});

// PUT /api/event-categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const data = await eventCategoryService.updateCategory(req.params.id, req.body);
  return successResponse(res, 200, 'Event category updated successfully', data);
});

// DELETE /api/event-categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  await eventCategoryService.deleteCategory(req.params.id);
  return successResponse(res, 200, 'Event category deleted successfully');
});

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
