const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const workspaceService    = require('../services/workspace.service');
const { broadcastDataChange } = require('../utils/realtimeBroadcast');

// GET /api/workspaces
const getAllWorkspaces = asyncHandler(async (req, res) => {
  const data = await workspaceService.getAllWorkspaces(req.query);
  return successResponse(res, 200, 'Workspaces fetched successfully', data);
});

// GET /api/workspaces/my
const getMyWorkspaces = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const data = await workspaceService.getMyWorkspaces(userId, req.query);
  return successResponse(res, 200, 'My workspaces fetched successfully', data);
});

// GET /api/workspaces/:id
const getWorkspaceById = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const data = await workspaceService.getWorkspaceById(req.params.id, userId);
  return successResponse(res, 200, 'Workspace fetched successfully', data);
});

// POST /api/workspaces
const createWorkspace = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const data = await workspaceService.createWorkspace(req.body, userId);
  broadcastDataChange('workspace', 'created', data);
  return successResponse(res, 201, 'Workspace created successfully', data);
});

// PUT /api/workspaces/:id
const updateWorkspace = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const data = await workspaceService.updateWorkspace(req.params.id, req.body, userId, req.user?.role);
  broadcastDataChange('workspace', 'updated', data);
  return successResponse(res, 200, 'Workspace updated successfully', data);
});

// DELETE /api/workspaces/:id
const deleteWorkspace = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  await workspaceService.deleteWorkspace(req.params.id, userId, req.user?.role);
  broadcastDataChange('workspace', 'deleted', { id: req.params.id });
  return successResponse(res, 200, 'Workspace deleted successfully');
});

// PATCH /api/workspaces/:id/archive
const archiveWorkspace = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const data = await workspaceService.archiveWorkspace(req.params.id, userId, req.user?.role);
  broadcastDataChange('workspace', 'archived', data);
  return successResponse(res, 200, 'Workspace archived successfully', data);
});

// PATCH /api/workspaces/:id/restore
const restoreWorkspace = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const data = await workspaceService.restoreWorkspace(req.params.id, userId, req.user?.role);
  broadcastDataChange('workspace', 'restored', data);
  return successResponse(res, 200, 'Workspace restored successfully', data);
});

// POST /api/workspaces/:id/duplicate
const duplicateWorkspace = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const data = await workspaceService.duplicateWorkspace(req.params.id, userId);
  broadcastDataChange('workspace', 'created', data);
  return successResponse(res, 201, 'Workspace duplicated successfully', data);
});

// GET /api/workspaces/:id/stats
const getWorkspaceStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const data = await workspaceService.getWorkspaceStats(req.params.id, userId, req.user?.role);
  return successResponse(res, 200, 'Workspace stats fetched successfully', data);
});

module.exports = {
  getAllWorkspaces,
  getMyWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  archiveWorkspace,
  restoreWorkspace,
  duplicateWorkspace,
  getWorkspaceStats,
};
