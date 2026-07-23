const mongoose = require('mongoose');

const workspaceMemberSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    workspaceId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Workspace',
      required: [true, 'Workspace ID is required'],
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User ID is required'],
    },

    // ─── Role & Permissions ───────────────────────────────────────────────────
    role: {
      type:    String,
      enum:    ['owner', 'admin', 'editor', 'viewer'],
      default: 'editor',
    },

    // ─── Timestamps ───────────────────────────────────────────────────────────
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
workspaceMemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });
workspaceMemberSchema.index({ userId: 1, joinedAt: -1 });
workspaceMemberSchema.index({ workspaceId: 1, role: 1 });

module.exports = mongoose.model('WorkspaceMember', workspaceMemberSchema, 'workspaceMembers');
