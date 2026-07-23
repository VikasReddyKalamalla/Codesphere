const mongoose = require('mongoose');

const eventBookmarkSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    eventId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Event',
      required: [true, 'Event ID is required'],
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User ID is required'],
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
eventBookmarkSchema.index({ eventId: 1, userId: 1 }, { unique: true });
eventBookmarkSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('EventBookmark', eventBookmarkSchema);
