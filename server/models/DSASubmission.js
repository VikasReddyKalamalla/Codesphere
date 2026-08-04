const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  input:          { type: String, default: '' },
  expected:       { type: String, default: '' },
  actual:         { type: String, default: '' },
  passed:         { type: Boolean, default: false },
  executionTime:  { type: Number, default: 0 },   // ms
  memoryUsed:     { type: Number, default: 0 },    // KB
}, { _id: false });

const dsaSubmissionSchema = new mongoose.Schema(
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

    // ─── Code ─────────────────────────────────────────────────────────────────
    language: {
      type:     String,
      required: [true, 'Language is required'],
      trim:     true,
      lowercase: true,
    },
    code: {
      type:     String,
      required: [true, 'Code is required'],
    },

    // ─── Execution Results ────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    {
        values: ['accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compilation_error', 'pending'],
        message: '{VALUE} is not valid',
      },
      default: 'pending',
    },
    runtime:     { type: Number, default: 0 },     // ms
    memory:      { type: Number, default: 0 },      // KB
    testResults: [testResultSchema],
    totalTests:  { type: Number, default: 0 },
    passedTests: { type: Number, default: 0 },
    errorMessage:{ type: String, default: '' },

    // ─── Timestamps ───────────────────────────────────────────────────────────
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
dsaSubmissionSchema.index({ userId: 1, problemId: 1 });
dsaSubmissionSchema.index({ userId: 1, submittedAt: -1 });
dsaSubmissionSchema.index({ problemId: 1, status: 1 });

module.exports = mongoose.model('DSASubmission', dsaSubmissionSchema);
