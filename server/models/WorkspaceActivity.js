const mongoose = require('mongoose');

const workspaceActivitySchema = new mongoose.Schema(
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

    // ─── Activity Details ─────────────────────────────────────────────────────
    activityType: {
      type: String,
      enum: [
        'workspace_created',
        'workspace_updated',
        'member_joined',
        'member_left',
        'member_removed',
        'task_created',
        'task_updated',
        'task_assigned',
        'task_completed',
        'milestone_created',
        'milestone_completed',
        'comment_added',
        'attachment_uploaded',
        'settings_updated',
        'code_edited',
        'file_created',
        'file_deleted',
        'terminal_used',
        'preview_opened',
        'github_linked',
      ],
      required: [true, 'Activity type is required'],
    },
    description: { type: String, default: '' },

    // ─── Referenced Entity ────────────────────────────────────────────────────
    entityType: {
      type: String,
      enum: ['workspace', 'task', 'milestone', 'member', 'comment', 'attachment', 'settings', 'file', 'terminal', 'chat'],
      default: 'workspace',
    },
    entityId: {
      type:    mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
workspaceActivitySchema.index({ workspaceId: 1, createdAt: -1 });
workspaceActivitySchema.index({ userId: 1 });
workspaceActivitySchema.index({ activityType: 1 });

module.exports = mongoose.model('WorkspaceActivity', workspaceActivitySchema, 'workspaceActivities');
