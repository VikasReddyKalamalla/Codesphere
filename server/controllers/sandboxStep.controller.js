const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const sandboxStepService  = require('../services/sandboxStep.service');

// GET /api/sandbox/:id/steps
const getProjectSteps = asyncHandler(async (req, res) => {
  const data = await sandboxStepService.getProjectSteps(req.params.id);
  return successResponse(res, 200, 'Steps fetched successfully', data);
});

// GET /api/steps/:id
const getStepById = asyncHandler(async (req, res) => {
  const data = await sandboxStepService.getStepById(req.params.id);
  return successResponse(res, 200, 'Step fetched successfully', data);
});

// POST /api/steps
const createStep = asyncHandler(async (req, res) => {
  const data = await sandboxStepService.createStep(req.body, req.user._id, req.user.role);
  return successResponse(res, 201, 'Step created successfully', data);
});

// PUT /api/steps/:id
const updateStep = asyncHandler(async (req, res) => {
  const data = await sandboxStepService.updateStep(req.params.id, req.body, req.user._id, req.user.role);
  return successResponse(res, 200, 'Step updated successfully', data);
});

// DELETE /api/steps/:id
const deleteStep = asyncHandler(async (req, res) => {
  await sandboxStepService.deleteStep(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Step deleted successfully');
});

// PUT /api/sandbox/:id/steps/reorder
const reorderSteps = asyncHandler(async (req, res) => {
  const data = await sandboxStepService.reorderSteps(req.params.id, req.body.orderedIds, req.user._id, req.user.role);
  return successResponse(res, 200, 'Steps reordered successfully', data);
});

module.exports = { getProjectSteps, getStepById, createStep, updateStep, deleteStep, reorderSteps };
