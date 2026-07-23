const SandboxBookmark = require('../models/SandboxBookmark');
const SandboxProject  = require('../models/SandboxProject');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── ADD BOOKMARK ─────────────────────────────────────────────────────────────
const addBookmark = async (projectId, userId) => {
  const project = await SandboxProject.findById(projectId);
  if (!project) throw createError('Sandbox project not found', 404);

  const existing = await SandboxBookmark.findOne({ projectId, userId });
  if (existing) throw createError('Project is already bookmarked', 409);

  const bookmark = await SandboxBookmark.create({ projectId, userId });

  await SandboxProject.findByIdAndUpdate(projectId, { $inc: { bookmarkCount: 1 } });

  return bookmark;
};

// ─── REMOVE BOOKMARK ──────────────────────────────────────────────────────────
const removeBookmark = async (projectId, userId) => {
  const bookmark = await SandboxBookmark.findOneAndDelete({ projectId, userId });
  if (!bookmark) throw createError('Bookmark not found', 404);

  await SandboxProject.findByIdAndUpdate(projectId, { $inc: { bookmarkCount: -1 } });

  return { message: 'Bookmark removed successfully' };
};

// ─── GET USER BOOKMARKS ───────────────────────────────────────────────────────
const getUserBookmarks = async (userId, { page = 1, limit = 12 }) => {
  const total = await SandboxBookmark.countDocuments({ userId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const bookmarks = await SandboxBookmark.find({ userId })
    .populate({
      path:   'projectId',
      select: 'title description thumbnail difficulty category technologyStack estimatedDuration instructor enrolledCount stepCount status',
      populate: { path: 'instructor', select: 'fullName avatar' },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  const projects = bookmarks
    .filter((b) => b.projectId)
    .map((b) => ({ ...b.projectId.toObject(), bookmarkedAt: b.createdAt }));

  return { ...meta, projects };
};

// ─── CHECK IF BOOKMARKED ──────────────────────────────────────────────────────
const isBookmarked = async (projectId, userId) => {
  const exists = await SandboxBookmark.findOne({ projectId, userId });
  return { isBookmarked: !!exists };
};

module.exports = { addBookmark, removeBookmark, getUserBookmarks, isBookmarked };
