const mongoose = require('mongoose');

const taskCommentSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    taskId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Task',
      required: [true, 'Task ID is required'],
    },
    author: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Author is required'],
    },

    // ─── Content ──────────────────────────────────────────────────────────────
    content: {
      type:      String,
      required:  [true, 'Comment content is required'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },

    // ─── Nested Replies ───────────────────────────────────────────────────────
    parentComment: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'TaskComment',
      default: null,
    },

    // ─── Meta ─────────────────────────────────────────────────────────────────
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
taskCommentSchema.index({ taskId: 1, createdAt: 1 });
taskCommentSchema.index({ author: 1 });
taskCommentSchema.index({ parentComment: 1 });

module.exports = mongoose.model('TaskComment', taskCommentSchema);
