const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const commentService      = require('../services/comment.service');

// GET /api/comments/:postId
const getCommentsByPost = asyncHandler(async (req, res) => {
  const data = await commentService.getCommentsByPost(req.params.postId, req.query);
  return successResponse(res, 200, 'Comments fetched successfully', data);
});

// POST /api/comments
const addComment = asyncHandler(async (req, res) => {
  const data = await commentService.addComment(req.body, req.user._id);
  return successResponse(res, 201, 'Comment added successfully', data);
});

// PUT /api/comments/:id
const updateComment = asyncHandler(async (req, res) => {
  const data = await commentService.updateComment(req.params.id, req.body.content, req.user._id);
  return successResponse(res, 200, 'Comment updated successfully', data);
});

// DELETE /api/comments/:id
const deleteComment = asyncHandler(async (req, res) => {
  await commentService.deleteComment(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Comment deleted successfully');
});

// POST /api/comments/:id/like
const toggleCommentLike = asyncHandler(async (req, res) => {
  const data = await commentService.toggleCommentLike(req.params.id, req.user._id);
  return successResponse(res, 200, 'Comment like toggled successfully', data);
});

module.exports = { getCommentsByPost, addComment, updateComment, deleteComment, toggleCommentLike };
