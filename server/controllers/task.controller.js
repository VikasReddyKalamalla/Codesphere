const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const taskService         = require('../services/task.service');

// GET /api/workspaces/:id/tasks
const getWorkspaceTasks = asyncHandler(async (req, res) => {
  const data = await taskService.getWorkspaceTasks(req.params.id, req.user._id, req.query);
  return successResponse(res, 200, 'Tasks fetched successfully', data);
});

// GET /api/tasks/my
const getMyTasks = asyncHandler(async (req, res) => {
  const data = await taskService.getMyTasks(req.user._id, req.query);
  return successResponse(res, 200, 'My tasks fetched successfully', data);
});

// GET /api/tasks/:id
const getTaskById = asyncHandler(async (req, res) => {
  const data = await taskService.getTaskById(req.params.id, req.user._id);
  return successResponse(res, 200, 'Task fetched successfully', data);
});

// POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const data = await taskService.createTask(req.body, req.user._id);
  return successResponse(res, 201, 'Task created successfully', data);
});

// PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const data = await taskService.updateTask(req.params.id, req.body, req.user._id, req.user.role);
  return successResponse(res, 200, 'Task updated successfully', data);
});

// DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Task deleted successfully');
});

module.exports = {
  getWorkspaceTasks,
  getMyTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
