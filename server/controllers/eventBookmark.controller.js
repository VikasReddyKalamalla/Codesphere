const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const eventBookmarkService  = require('../services/eventBookmark.service');

// POST /api/events/:id/bookmark
const addBookmark = asyncHandler(async (req, res) => {
  const data = await eventBookmarkService.addBookmark(req.params.id, req.user._id);
  return successResponse(res, 201, 'Event bookmarked successfully', data);
});

// DELETE /api/events/:id/bookmark
const removeBookmark = asyncHandler(async (req, res) => {
  const data = await eventBookmarkService.removeBookmark(req.params.id, req.user._id);
  return successResponse(res, 200, 'Bookmark removed successfully', data);
});

// GET /api/events/my/bookmarks
const getUserBookmarks = asyncHandler(async (req, res) => {
  const data = await eventBookmarkService.getUserBookmarks(req.user._id, req.query);
  return successResponse(res, 200, 'Bookmarked events fetched successfully', data);
});

// GET /api/events/:id/bookmark-status
const isBookmarked = asyncHandler(async (req, res) => {
  const data = await eventBookmarkService.isBookmarked(req.params.id, req.user._id);
  return successResponse(res, 200, 'Bookmark status fetched successfully', data);
});

module.exports = { addBookmark, removeBookmark, getUserBookmarks, isBookmarked };
