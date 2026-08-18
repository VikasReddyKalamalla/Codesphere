const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    learningPathId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'LearningPath',
      required: true,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    isCompleted:          { type: Boolean, default: false },
    completedAt:          { type: Date, default: null },
  },
  { timestamps: true }
);

// One progress record per user per learning path
progressSchema.index({ userId: 1, learningPathId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
