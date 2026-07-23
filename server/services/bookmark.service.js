const Bookmark = require('../models/Bookmark');
const Resource = require('../models/Resource');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── ADD BOOKMARK ─────────────────────────────────────────────────────────────
const addBookmark = async (userId, resourceId) => {
  const resource = await Resource.findById(resourceId);
  if (!resource) throw createError('Resource not found', 404);

  // Check if already bookmarked
  const exists = await Bookmark.findOne({ userId, resourceId });
  if (exists) throw createError('Resource is already bookmarked', 409);

  const bookmark = await Bookmark.create({ userId, resourceId });

  // Increment bookmarksCount on resource
  await Resource.findByIdAndUpdate(resourceId, { $inc: { bookmarksCount: 1 } });

  return bookmark;
};

// ─── REMOVE BOOKMARK ──────────────────────────────────────────────────────────
const removeBookmark = async (userId, resourceId) => {
  const bookmark = await Bookmark.findOneAndDelete({ userId, resourceId });
  if (!bookmark) throw createError('Bookmark not found', 404);

  // Decrement bookmarksCount on resource
  await Resource.findByIdAndUpdate(resourceId, { $inc: { bookmarksCount: -1 } });

  return { message: 'Bookmark removed successfully' };
};

// ─── GET USER BOOKMARKS ───────────────────────────────────────────────────────
const getUserBookmarks = async (userId, { page = 1, limit = 12 }) => {
  const total = await Bookmark.countDocuments({ userId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const bookmarks = await Bookmark.find({ userId })
    .populate({
      path:   'resourceId',
      select: 'title description thumbnail category resourceType averageRating views downloadsCount',
      populate: { path: 'category', select: 'name icon' },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  const resources = bookmarks
    .filter((b) => b.resourceId)
    .map((b) => ({ ...b.resourceId.toObject(), bookmarkedAt: b.createdAt }));

  return { ...meta, resources };
};

// ─── CHECK IF BOOKMARKED ──────────────────────────────────────────────────────
const isBookmarked = async (userId, resourceId) => {
  const exists = await Bookmark.findOne({ userId, resourceId });
  return { isBookmarked: !!exists };
};

module.exports = { addBookmark, removeBookmark, getUserBookmarks, isBookmarked };
