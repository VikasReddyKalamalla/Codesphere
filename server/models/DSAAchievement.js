const mongoose = require('mongoose');

const unlockSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  unlockedAt: { type: Date, default: Date.now },
}, { _id: false });

const dsaAchievementSchema = new mongoose.Schema(
  {
    // ─── Core Info ────────────────────────────────────────────────────────────
    key: {
      type:     String,
      required: [true, 'Achievement key is required'],
      unique:   true,
      trim:     true,
    },
    title: {
      type:     String,
      required: [true, 'Achievement title is required'],
      trim:     true,
    },
    description: {
      type:    String,
      default: '',
    },
    icon: { type: String, default: '🏆' },

    // ─── Unlock Condition ─────────────────────────────────────────────────────
    // JSON criteria: { type: 'total_solved', value: 10 }
    //            or: { type: 'topic_completed', value: 'arrays' }
    //            or: { type: 'streak', value: 7 }
    //            or: { type: 'difficulty_solved', difficulty: 'hard', value: 1 }
    condition: {
      type:    mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ─── Users who have unlocked this ─────────────────────────────────────────
    unlockedBy: [unlockSchema],

    // ─── Display Order ────────────────────────────────────────────────────────
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
dsaAchievementSchema.index({ key: 1 }, { unique: true });
dsaAchievementSchema.index({ 'unlockedBy.userId': 1 });

module.exports = mongoose.model('DSAAchievement', dsaAchievementSchema);
