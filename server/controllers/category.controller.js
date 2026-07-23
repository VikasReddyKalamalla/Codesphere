const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const categoryService     = require('../services/category.service');

// GET /api/categories
const getAllCategories = asyncHandler(async (req, res) => {
  const data = await categoryService.getAllCategories();
  return successResponse(res, 200, 'Categories fetched successfully', data);
});

// GET /api/categories/:id
const getCategoryById = asyncHandler(async (req, res) => {
  const data = await categoryService.getCategoryById(req.params.id);
  return successResponse(res, 200, 'Category fetched successfully', data);
});

// POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const data = await categoryService.createCategory(req.body);
  return successResponse(res, 201, 'Category created successfully', data);
});

// PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const data = await categoryService.updateCategory(req.params.id, req.body);
  return successResponse(res, 200, 'Category updated successfully', data);
});

// DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return successResponse(res, 200, 'Category deleted successfully');
});

// POST /api/categories/seed  (admin utility)
const seedCategories = asyncHandler(async (req, res) => {
  await categoryService.seedCategories();
  return successResponse(res, 200, 'Default categories seeded successfully');
});

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, seedCategories };
