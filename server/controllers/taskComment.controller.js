const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const taskCommentService  = require('../services/taskComment.service');

// GET /api/tasks/:id/comments
const getTaskComments = asyncHandler(async (req, res) => {
  const data = await taskCommentService.getTaskComments(req.params.id, req.user._id, req.query);
  return successResponse(res, 200, 'Comments fetched successfully', data);
});

// POST /api/tasks/:id/comments
const addComment = asyncHandler(async (req, res) => {
  const data = await taskCommentService.addComment(req.params.id, req.body, req.user._id);
  return successResponse(res, 201, 'Comment added successfully', data);
});

// PUT /api/comments/:id
const editComment = asyncHandler(async (req, res) => {
  const data = await taskCommentService.editComment(req.params.id, req.body, req.user._id);
  return successResponse(res, 200, 'Comment updated successfully', data);
});

// DELETE /api/comments/:id
const deleteComment = asyncHandler(async (req, res) => {
  await taskCommentService.deleteComment(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Comment deleted successfully');
});

// GET /api/comments/:id/replies
const getReplies = asyncHandler(async (req, res) => {
  const data = await taskCommentService.getReplies(req.params.id, req.user._id);
  return successResponse(res, 200, 'Replies fetched successfully', data);
});

module.exports = { getTaskComments, addComment, editComment, deleteComment, getReplies };
