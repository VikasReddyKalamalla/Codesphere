const mongoose = require('mongoose');

const workspaceInviteSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    workspaceId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Workspace',
      required: [true, 'Workspace ID is required'],
    },
    invitedUserId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Invited user ID is required'],
    },
    invitedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Inviter is required'],
    },

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    { values: ['pending', 'accepted', 'rejected'], message: '{VALUE} is not a valid status' },
      default: 'pending',
    },

    // ─── Role Assignment ──────────────────────────────────────────────────────
    role: {
      type:    String,
      enum:    ['admin', 'editor', 'viewer'],
      default: 'editor',
    },

    // ─── Timestamps ───────────────────────────────────────────────────────────
    invitedAt:  { type: Date, default: Date.now },
    respondedAt:{ type: Date, default: null },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
workspaceInviteSchema.index({ workspaceId: 1, invitedUserId: 1 }, { unique: true });
workspaceInviteSchema.index({ invitedUserId: 1, status: 1 });
workspaceInviteSchema.index({ workspaceId: 1, status: 1 });

module.exports = mongoose.model('WorkspaceInvite', workspaceInviteSchema, 'workspaceInvitations');
