const mongoose = require('mongoose');

const dsaUserProgressSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User ID is required'],
    },
    problemId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'DSAProblem',
      required: [true, 'Problem ID is required'],
    },
    topicId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'DSATopic',
      required: [true, 'Topic ID is required'],
    },

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    { values: ['not_started', 'in_progress', 'solved', 'needs_revision'], message: '{VALUE} is not valid' },
      default: 'not_started',
    },

    // ─── Timing ───────────────────────────────────────────────────────────────
    solvedAt:      { type: Date, default: null },
    lastAttemptAt: { type: Date, default: null },
    totalTime:     { type: Number, default: 0 },     // minutes spent
    attempts:      { type: Number, default: 0 },

    // ─── Bookmark Labels ──────────────────────────────────────────────────────
    bookmarkLabels: [{
      type: String,
      enum: ['bookmark', 'needs_revision', 'favourite', 'important', 'interview'],
    }],

    // ─── Personal Notes ───────────────────────────────────────────────────────
    personalNotes: { type: String, default: '' }, // markdown, autosaved

    // ─── Editorial Unlock ─────────────────────────────────────────────────────
    editorialUnlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
dsaUserProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });
dsaUserProgressSchema.index({ userId: 1, topicId: 1 });
dsaUserProgressSchema.index({ userId: 1, status: 1 });
dsaUserProgressSchema.index({ userId: 1, bookmarkLabels: 1 });

module.exports = mongoose.model('DSAUserProgress', dsaUserProgressSchema);
