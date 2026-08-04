const mongoose = require('mongoose');

const dsaSectionSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    topicId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'DSATopic',
      required: [true, 'Topic reference is required'],
    },

    // ─── Core Info ────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Section title is required'],
      trim:      true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type:    String,
      default: '',
    },
    order: {
      type:     Number,
      required: [true, 'Section order is required'],
      min:      [1, 'Order must be at least 1'],
    },

    // ─── Type ─────────────────────────────────────────────────────────────────
    type: {
      type:    String,
      enum:    { values: ['difficulty', 'pattern', 'category'], message: '{VALUE} is not valid' },
      default: 'difficulty',
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
dsaSectionSchema.index({ topicId: 1, order: 1 });

module.exports = mongoose.model('DSASection', dsaSectionSchema);
