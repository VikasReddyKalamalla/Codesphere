const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    workspaceId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Workspace',
      required: [true, 'Workspace ID is required'],
    },
    assignedTo: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'User',
      default: null,
    },
    reporter: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Reporter is required'],
    },
    milestoneId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Milestone',
      default: null,
    },

    // ─── Core Info ────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Task title is required'],
      trim:      true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },

    // ─── Classification ───────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    { values: ['backlog', 'todo', 'in_progress', 'review', 'testing', 'completed', 'cancelled', 'blocked'], message: '{VALUE} is not a valid status' },
      default: 'todo',
    },
    priority: {
      type:    String,
      enum:    { values: ['low', 'medium', 'high', 'critical'], message: '{VALUE} is not a valid priority' },
      default: 'medium',
    },
    labels: [{ type: String, trim: true, lowercase: true }],

    // ─── Timing ───────────────────────────────────────────────────────────────
    dueDate:        { type: Date, default: null },
    estimatedHours: { type: Number, default: 0 },
    completedHours: { type: Number, default: 0 },
    completedAt:    { type: Date, default: null },

    // ─── Stats ────────────────────────────────────────────────────────────────
    commentCount:    { type: Number, default: 0 },
    attachmentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
taskSchema.index({ workspaceId: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ reporter: 1 });
taskSchema.index({ milestoneId: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', taskSchema, 'workspaceTasks');
