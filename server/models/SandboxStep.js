const mongoose = require('mongoose');

const sandboxStepSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    projectId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'SandboxProject',
      required: [true, 'Project ID is required'],
    },

    // ─── Core Info ────────────────────────────────────────────────────────────
    stepNumber: {
      type:     Number,
      required: [true, 'Step number is required'],
      min:      [1, 'Step number must be at least 1'],
    },
    title: {
      type:      String,
      required:  [true, 'Step title is required'],
      trim:      true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [10000, 'Description cannot exceed 10000 characters'],
    },

    // ─── Details ──────────────────────────────────────────────────────────────
    objectives:    [{ type: String, trim: true }],
    instructions:  { type: String, default: '' },
    resources:     [{ type: String, trim: true }],
    estimatedTime: { type: String, default: '' }, // e.g. "45 minutes"

    // ─── Status ───────────────────────────────────────────────────────────────
    isOptional: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
sandboxStepSchema.index({ projectId: 1, stepNumber: 1 }, { unique: true });
sandboxStepSchema.index({ projectId: 1 });

module.exports = mongoose.model('SandboxStep', sandboxStepSchema);
