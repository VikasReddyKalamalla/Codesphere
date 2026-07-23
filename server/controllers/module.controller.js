const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const moduleService       = require('../services/module.service');

// GET /api/modules/:learningPathId
const getModulesByPath = asyncHandler(async (req, res) => {
  const data = await moduleService.getModulesByPath(req.params.learningPathId);
  return successResponse(res, 200, 'Modules fetched successfully', data);
});

// GET /api/modules/single/:id
const getModuleById = asyncHandler(async (req, res) => {
  const data = await moduleService.getModuleById(req.params.id);
  return successResponse(res, 200, 'Module fetched successfully', data);
});

// POST /api/modules
const createModule = asyncHandler(async (req, res) => {
  const data = await moduleService.createModule(req.body);
  return successResponse(res, 201, 'Module created successfully', data);
});

// PUT /api/modules/:id
const updateModule = asyncHandler(async (req, res) => {
  const data = await moduleService.updateModule(req.params.id, req.body);
  return successResponse(res, 200, 'Module updated successfully', data);
});

// DELETE /api/modules/:id
const deleteModule = asyncHandler(async (req, res) => {
  await moduleService.deleteModule(req.params.id);
  return successResponse(res, 200, 'Module deleted successfully');
});

module.exports = { getModulesByPath, getModuleById, createModule, updateModule, deleteModule };
