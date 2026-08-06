const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema(
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

    // ─── Attempt Info ─────────────────────────────────────────────────────────
    attemptNumber: { type: Number, default: 1 },

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    { values: ['in_progress', 'paused', 'submitted', 'expired'], message: '{VALUE} is not a valid status' },
      default: 'in_progress',
    },

    // ─── Timing ───────────────────────────────────────────────────────────────
    startTime:   { type: Date, default: Date.now },
    endTime:     { type: Date, default: null },
    pausedAt:    { type: Date, default: null },
    submittedAt: { type: Date, default: null },
    timeTaken:   { type: Number, default: 0 }, // in seconds
    timeLimit:   { type: Number, default: 0 }, // in seconds (copied from test)

    // ─── Answers (embedded) ──────────────────────────────────────────────────
    answers: [{
      questionId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      selectedAnswer: { type: String, default: '' },
      isCorrect:      { type: Boolean, default: false },
      marksAwarded:   { type: Number, default: 0 },
      timeTaken:      { type: Number, default: 0 }, // in seconds
    }],

    // ─── Result (calculated on submit) ────────────────────────────────────────
    totalScore:       { type: Number, default: 0 },
    percentage:       { type: Number, default: 0 },
    correctAnswers:   { type: Number, default: 0 },
    wrongAnswers:     { type: Number, default: 0 },
    skippedQuestions: { type: Number, default: 0 },
    passed:           { type: Boolean, default: false },
    rank:             { type: Number, default: null },

    // ─── Anti-Cheat & Proctoring ──────────────────────────────────────────────
    proctoringWarnings: { type: Number, default: 0 },
    tabSwitchCount:     { type: Number, default: 0 },
    questionOrder:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
testAttemptSchema.index({ testId: 1, userId: 1, attemptNumber: 1 }, { unique: true });
testAttemptSchema.index({ userId: 1, status: 1 });
testAttemptSchema.index({ testId: 1, totalScore: -1 });

module.exports = mongoose.model('TestAttempt', testAttemptSchema);
