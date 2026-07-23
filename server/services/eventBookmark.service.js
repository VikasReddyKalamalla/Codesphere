const EventBookmark = require('../models/EventBookmark');
const Event         = require('../models/Event');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── ADD BOOKMARK ─────────────────────────────────────────────────────────────
const addBookmark = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) throw createError('Event not found', 404);

  // Check if already bookmarked
  const existing = await EventBookmark.findOne({ eventId, userId });
  if (existing) throw createError('Event is already bookmarked', 409);

  const bookmark = await EventBookmark.create({ eventId, userId });

  // Increment bookmark count
  await Event.findByIdAndUpdate(eventId, { $inc: { bookmarkCount: 1 } });

  return bookmark;
};

// ─── REMOVE BOOKMARK ──────────────────────────────────────────────────────────
const removeBookmark = async (eventId, userId) => {
  const bookmark = await EventBookmark.findOneAndDelete({ eventId, userId });
  if (!bookmark) throw createError('Bookmark not found', 404);

  // Decrement bookmark count
  await Event.findByIdAndUpdate(eventId, { $inc: { bookmarkCount: -1 } });

  return { message: 'Bookmark removed successfully' };
};

// ─── GET USER BOOKMARKS ───────────────────────────────────────────────────────
const getUserBookmarks = async (userId, { page = 1, limit = 12 }) => {
  const total = await EventBookmark.countDocuments({ userId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const bookmarks = await EventBookmark.find({ userId })
    .populate({
      path:   'eventId',
      select: 'title description thumbnail startDate endDate status organizer category eventType mode city country registeredParticipants maxParticipants',
      populate: [
        { path: 'organizer', select: 'fullName avatar' },
        { path: 'category', select: 'name icon color' },
      ],
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  const events = bookmarks
    .filter((b) => b.eventId)
    .map((b) => ({ ...b.eventId.toObject(), bookmarkedAt: b.createdAt }));

  return { ...meta, events };
};

// ─── CHECK IF BOOKMARKED ──────────────────────────────────────────────────────
const isBookmarked = async (eventId, userId) => {
  const exists = await EventBookmark.findOne({ eventId, userId });
  return { isBookmarked: !!exists };
};

module.exports = { addBookmark, removeBookmark, getUserBookmarks, isBookmarked };
