const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    testId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Test',
      required: [true, 'Test ID is required'],
    },

    // ─── Core Info ────────────────────────────────────────────────────────────
    questionTitle: {
      type:      String,
      required:  [true, 'Question title is required'],
      maxlength: [500, 'Question title cannot exceed 500 characters'],
    },
    questionDescription: {
      type:      String,
      default:   '',
      maxlength: [5000, 'Question description cannot exceed 5000 characters'],
    },

    // ─── Question Type ────────────────────────────────────────────────────────
    questionType: {
      type:    String,
      enum:    {
        values:  ['mcq', 'true_false', 'fill_blank', 'short_answer', 'long_answer', 'coding', 'system_design'],
        message: '{VALUE} is not a valid question type',
      },
      default: 'mcq',
    },

    // ─── Options (for MCQ/true-false) ─────────────────────────────────────────
    options:       [{ type: String, trim: true }],
    correctAnswer: { type: String, default: '' },  // stores option index/text or correct answer for other types
    imageUrl:      { type: String, default: '' },  // for image-based questions

    // ─── Classification ───────────────────────────────────────────────────────
    difficulty: {
      type:    String,
      enum:    { values: ['beginner', 'intermediate', 'advanced', 'expert'], message: '{VALUE} is not a valid difficulty' },
      default: 'beginner',
    },
    technology: { type: String, default: '', trim: true },
    tags:       [{ type: String, trim: true, lowercase: true }],

    // ─── Marks ────────────────────────────────────────────────────────────────
    marks:         { type: Number, default: 1, min: 0 },
    negativeMarks: { type: Number, default: 0, min: 0 },

    // ─── Help & Context ───────────────────────────────────────────────────────
    explanation: { type: String, default: '' },
    hints:       [{ type: String, trim: true }],
    codeSnippet: { type: String, default: '' },  // for coding questions

    // ─── Order ────────────────────────────────────────────────────────────────
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
questionSchema.index({ testId: 1, orderIndex: 1 });
questionSchema.index({ testId: 1 });
questionSchema.index({ questionType: 1 });

module.exports = mongoose.model('Question', questionSchema);
