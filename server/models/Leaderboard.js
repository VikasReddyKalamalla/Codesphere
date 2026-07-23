const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
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
    attemptId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'TestAttempt',
      required: [true, 'Attempt ID is required'],
    },

    // ─── Score Info ───────────────────────────────────────────────────────────
    score:      { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    rank:       { type: Number, default: null },
    timeTaken:  { type: Number, default: 0 }, // in seconds

    // ─── Timestamps ───────────────────────────────────────────────────────────
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
leaderboardSchema.index({ testId: 1, score: -1, timeTaken: 1 });
leaderboardSchema.index({ testId: 1, userId: 1 }, { unique: true });
leaderboardSchema.index({ userId: 1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
