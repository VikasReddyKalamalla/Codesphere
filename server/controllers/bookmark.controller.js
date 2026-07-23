const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const bookmarkService     = require('../services/bookmark.service');

// POST /api/resources/:id/bookmark
const addBookmark = asyncHandler(async (req, res) => {
  const data = await bookmarkService.addBookmark(req.user._id, req.params.id);
  return successResponse(res, 201, 'Resource bookmarked successfully', data);
});

// DELETE /api/resources/:id/bookmark
const removeBookmark = asyncHandler(async (req, res) => {
  const data = await bookmarkService.removeBookmark(req.user._id, req.params.id);
  return successResponse(res, 200, 'Bookmark removed successfully', data);
});

// GET /api/bookmarks
const getUserBookmarks = asyncHandler(async (req, res) => {
  const data = await bookmarkService.getUserBookmarks(req.user._id, req.query);
  return successResponse(res, 200, 'Bookmarks fetched successfully', data);
});

// GET /api/resources/:id/bookmark/check
const isBookmarked = asyncHandler(async (req, res) => {
  const data = await bookmarkService.isBookmarked(req.user._id, req.params.id);
  return successResponse(res, 200, 'Bookmark status checked', data);
});

module.exports = { addBookmark, removeBookmark, getUserBookmarks, isBookmarked };
