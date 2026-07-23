const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    // ─── Parent Reference ─────────────────────────────────────────────────────
    learningPathId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'LearningPath',
      required: [true, 'Learning path reference is required'],
    },

    // ─── Core Info ────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Module title is required'],
      trim:      true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // ─── Ordering ─────────────────────────────────────────────────────────────
    order: {
      type:     Number,
      required: [true, 'Module order is required'],
      min:      [1, 'Order must be at least 1'],
    },

    // ─── Relationships ────────────────────────────────────────────────────────
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],

    // ─── Stats ────────────────────────────────────────────────────────────────
    duration: { type: Number, default: 0 }, // sum of lesson durations
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
moduleSchema.index({ learningPathId: 1, order: 1 });

module.exports = mongoose.model('Module', moduleSchema);
