const TestBookmark     = require('../models/TestBookmark');
const Test             = require('../models/Test');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const addBookmark = async (testId, userId) => {
  const test = await Test.findById(testId);
  if (!test) throw createError('Test not found', 404);

  const existing = await TestBookmark.findOne({ testId, userId });
  if (existing) throw createError('Test is already bookmarked', 409);

  const bookmark = await TestBookmark.create({ testId, userId });
  await Test.findByIdAndUpdate(testId, { $inc: { bookmarkCount: 1 } });

  return bookmark;
};

const removeBookmark = async (testId, userId) => {
  const bookmark = await TestBookmark.findOneAndDelete({ testId, userId });
  if (!bookmark) throw createError('Bookmark not found', 404);

  await Test.findByIdAndUpdate(testId, { $inc: { bookmarkCount: -1 } });

  return { message: 'Bookmark removed successfully' };
};

const getUserBookmarks = async (userId, { page = 1, limit = 12 }) => {
  const total = await TestBookmark.countDocuments({ userId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const bookmarks = await TestBookmark.find({ userId })
    .populate({
      path:   'testId',
      select: 'title description thumbnail difficulty technology duration totalQuestions totalMarks instructor status',
      populate: { path: 'instructor', select: 'fullName avatar' },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  const tests = bookmarks.filter((b) => b.testId).map((b) => ({ ...b.testId.toObject(), bookmarkedAt: b.createdAt }));

  return { ...meta, tests };
};

const isBookmarked = async (testId, userId) => {
  const exists = await TestBookmark.findOne({ testId, userId });
  return { isBookmarked: !!exists };
};

module.exports = { addBookmark, removeBookmark, getUserBookmarks, isBookmarked };
