const mongoose = require('mongoose');

const testBookmarkSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    testId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Test',
      required: [true, 'Test ID is required'],
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
testBookmarkSchema.index({ testId: 1, userId: 1 }, { unique: true });
testBookmarkSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('TestBookmark', testBookmarkSchema);
