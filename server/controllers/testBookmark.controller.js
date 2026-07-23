const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const testBookmarkService   = require('../services/testBookmark.service');

const addBookmark      = asyncHandler(async (req, res) => successResponse(res, 201, 'Test bookmarked successfully', await testBookmarkService.addBookmark(req.params.id, req.user._id)));
const removeBookmark   = asyncHandler(async (req, res) => successResponse(res, 200, 'Bookmark removed successfully', await testBookmarkService.removeBookmark(req.params.id, req.user._id)));
const getUserBookmarks = asyncHandler(async (req, res) => successResponse(res, 200, 'Bookmarked tests fetched successfully', await testBookmarkService.getUserBookmarks(req.user._id, req.query)));
const isBookmarked     = asyncHandler(async (req, res) => successResponse(res, 200, 'Bookmark status fetched successfully', await testBookmarkService.isBookmarked(req.params.id, req.user._id)));

module.exports = { addBookmark, removeBookmark, getUserBookmarks, isBookmarked };
