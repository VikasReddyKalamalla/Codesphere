const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const questionCategoryService = require('../services/questionCategory.service');

const getAllCategories = asyncHandler(async (req, res) => successResponse(res, 200, 'Question categories fetched successfully', await questionCategoryService.getAllCategories()));
const getCategoryById  = asyncHandler(async (req, res) => successResponse(res, 200, 'Category fetched successfully', await questionCategoryService.getCategoryById(req.params.id)));
const createCategory   = asyncHandler(async (req, res) => successResponse(res, 201, 'Category created successfully', await questionCategoryService.createCategory(req.body)));
const updateCategory   = asyncHandler(async (req, res) => successResponse(res, 200, 'Category updated successfully', await questionCategoryService.updateCategory(req.params.id, req.body)));
const deleteCategory   = asyncHandler(async (req, res) => { await questionCategoryService.deleteCategory(req.params.id); return successResponse(res, 200, 'Category deleted successfully'); });

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
