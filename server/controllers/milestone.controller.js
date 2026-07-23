const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const milestoneService    = require('../services/milestone.service');

// GET /api/workspaces/:id/milestones
const getWorkspaceMilestones = asyncHandler(async (req, res) => {
  const data = await milestoneService.getWorkspaceMilestones(req.params.id, req.user._id);
  return successResponse(res, 200, 'Milestones fetched successfully', data);
});

// GET /api/milestones/:id
const getMilestoneById = asyncHandler(async (req, res) => {
  const data = await milestoneService.getMilestoneById(req.params.id, req.user._id);
  return successResponse(res, 200, 'Milestone fetched successfully', data);
});

// POST /api/milestones
const createMilestone = asyncHandler(async (req, res) => {
  const data = await milestoneService.createMilestone(req.body, req.user._id);
  return successResponse(res, 201, 'Milestone created successfully', data);
});

// PUT /api/milestones/:id
const updateMilestone = asyncHandler(async (req, res) => {
  const data = await milestoneService.updateMilestone(req.params.id, req.body, req.user._id, req.user.role);
  return successResponse(res, 200, 'Milestone updated successfully', data);
});

// PATCH /api/milestones/:id/complete
const completeMilestone = asyncHandler(async (req, res) => {
  const data = await milestoneService.completeMilestone(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Milestone marked as completed', data);
});

// DELETE /api/milestones/:id
const deleteMilestone = asyncHandler(async (req, res) => {
  await milestoneService.deleteMilestone(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Milestone deleted successfully');
});

module.exports = {
  getWorkspaceMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  completeMilestone,
  deleteMilestone,
};
