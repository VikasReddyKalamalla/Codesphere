const mongoose = require('mongoose');

const sandboxProgressSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    projectId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'SandboxProject',
      required: [true, 'Project ID is required'],
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User ID is required'],
    },

    // ─── Progress ─────────────────────────────────────────────────────────────
    currentStep:       { type: Number, default: 1 },
    completedSteps:    [{ type: Number }],
    totalSteps:        { type: Number, default: 0 },
    completionPercent: { type: Number, default: 0, min: 0, max: 100 },
    codeFiles:         { type: mongoose.Schema.Types.Mixed, default: null },

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    { values: ['not_started', 'in_progress', 'completed'], message: '{VALUE} is not a valid status' },
      default: 'not_started',
    },

    // ─── Timing ───────────────────────────────────────────────────────────────
    startedAt:   { type: Date, default: null },
    completedAt: { type: Date, default: null },
    timeSpent:   { type: Number, default: 0 }, // in minutes
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
sandboxProgressSchema.index({ projectId: 1, userId: 1 }, { unique: true });
sandboxProgressSchema.index({ userId: 1, status: 1 });
sandboxProgressSchema.index({ projectId: 1, completionPercent: -1 });

module.exports = mongoose.model('SandboxProgress', sandboxProgressSchema);
