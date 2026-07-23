const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const postService         = require('../services/post.service');

// GET /api/posts/:communityId
const getPostsByCommunity = asyncHandler(async (req, res) => {
  const data = await postService.getPostsByCommunity(req.params.communityId, req.query);
  return successResponse(res, 200, 'Posts fetched successfully', data);
});

// GET /api/posts/single/:id
const getPostById = asyncHandler(async (req, res) => {
  const data = await postService.getPostById(req.params.id);
  return successResponse(res, 200, 'Post fetched successfully', data);
});

// POST /api/posts
const createPost = asyncHandler(async (req, res) => {
  const data = await postService.createPost(req.body, req.user._id);
  return successResponse(res, 201, 'Post created successfully', data);
});

// PUT /api/posts/:id
const updatePost = asyncHandler(async (req, res) => {
  const data = await postService.updatePost(req.params.id, req.body, req.user._id);
  return successResponse(res, 200, 'Post updated successfully', data);
});

// DELETE /api/posts/:id
const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Post deleted successfully');
});

// POST /api/posts/:id/like
const toggleLike = asyncHandler(async (req, res) => {
  const data = await postService.toggleLike(req.params.id, req.user._id);
  return successResponse(res, 200, 'Like toggled successfully', data);
});

// POST /api/posts/:id/bookmark
const toggleBookmark = asyncHandler(async (req, res) => {
  const data = await postService.toggleBookmark(req.params.id, req.user._id);
  return successResponse(res, 200, 'Bookmark toggled successfully', data);
});

// POST /api/posts/:id/pin
const togglePin = asyncHandler(async (req, res) => {
  const data = await postService.togglePin(req.params.id, req.user._id);
  return successResponse(res, 200, 'Pin toggled successfully', data);
});

module.exports = { getPostsByCommunity, getPostById, createPost, updatePost, deletePost, toggleLike, toggleBookmark, togglePin };
