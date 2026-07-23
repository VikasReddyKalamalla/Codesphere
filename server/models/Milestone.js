const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    workspaceId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Workspace',
      required: [true, 'Workspace ID is required'],
    },

    // ─── Core Info ────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Milestone title is required'],
      trim:      true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    // ─── Status & Progress ────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    { values: ['not_started', 'in_progress', 'completed'], message: '{VALUE} is not a valid status' },
      default: 'not_started',
    },
    completedAt: { type: Date, default: null },

    // ─── Timing ───────────────────────────────────────────────────────────────
    dueDate:  { type: Date, default: null },
    
    // ─── Stats ────────────────────────────────────────────────────────────────
    taskCount:          { type: Number, default: 0 },
    completedTaskCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
milestoneSchema.index({ workspaceId: 1, status: 1 });
milestoneSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Milestone', milestoneSchema);
