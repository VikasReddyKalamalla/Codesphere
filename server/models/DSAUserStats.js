const mongoose = require('mongoose');

const dsaUserStatsSchema = new mongoose.Schema(
  {
    // ─── User Reference ───────────────────────────────────────────────────────
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User ID is required'],
      unique:   true,
    },

    // ─── Solve Counts ─────────────────────────────────────────────────────────
    totalSolved:  { type: Number, default: 0 },
    easySolved:   { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved:   { type: Number, default: 0 },

    // ─── Streak ───────────────────────────────────────────────────────────────
    currentStreak:  { type: Number, default: 0 },  // consecutive days
    longestStreak:  { type: Number, default: 0 },
    lastSolvedDate: { type: Date, default: null },

    // ─── Performance ──────────────────────────────────────────────────────────
    averageSolveTime: { type: Number, default: 0 },   // minutes
    totalAttempts:    { type: Number, default: 0 },
    totalAccepted:    { type: Number, default: 0 },

    // ─── Topic Analysis ───────────────────────────────────────────────────────
    weakTopics:   [{ type: String }],   // topic slugs with < 40% completion
    strongTopics: [{ type: String }],   // topic slugs with > 80% completion
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
dsaUserStatsSchema.index({ userId: 1 }, { unique: true });
dsaUserStatsSchema.index({ totalSolved: -1 });

module.exports = mongoose.model('DSAUserStats', dsaUserStatsSchema);
