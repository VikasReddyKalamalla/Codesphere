const asyncHandler            = require('../utils/asyncHandler');
const { successResponse }     = require('../utils/apiResponse');
const sandboxBookmarkService  = require('../services/sandboxBookmark.service');

// POST /api/sandbox/:id/bookmark
const addBookmark = asyncHandler(async (req, res) => {
  const data = await sandboxBookmarkService.addBookmark(req.params.id, req.user._id);
  return successResponse(res, 201, 'Project bookmarked successfully', data);
});

// DELETE /api/sandbox/:id/bookmark
const removeBookmark = asyncHandler(async (req, res) => {
  const data = await sandboxBookmarkService.removeBookmark(req.params.id, req.user._id);
  return successResponse(res, 200, 'Bookmark removed successfully', data);
});

// GET /api/sandbox/my/bookmarks
const getUserBookmarks = asyncHandler(async (req, res) => {
  const data = await sandboxBookmarkService.getUserBookmarks(req.user._id, req.query);
  return successResponse(res, 200, 'Bookmarked projects fetched successfully', data);
});

// GET /api/sandbox/:id/bookmark-status
const isBookmarked = asyncHandler(async (req, res) => {
  const data = await sandboxBookmarkService.isBookmarked(req.params.id, req.user._id);
  return successResponse(res, 200, 'Bookmark status fetched successfully', data);
});

module.exports = { addBookmark, removeBookmark, getUserBookmarks, isBookmarked };
