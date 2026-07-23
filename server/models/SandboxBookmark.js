const mongoose = require('mongoose');

const sandboxBookmarkSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
sandboxBookmarkSchema.index({ projectId: 1, userId: 1 }, { unique: true });
sandboxBookmarkSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SandboxBookmark', sandboxBookmarkSchema);
