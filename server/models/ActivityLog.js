const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    module: {
      type: String,
      required: true,
      enum: [
        'Community',
        'Codex',
        'Session',
        'Notification',
        'Presence',
        'Dashboard',
        'Admin',
        'General',
      ],
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      // E.g. "joined_room", "sent_message", "connected", "disconnected"
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    referenceType: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    socketId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ module: 1, createdAt: -1 });

// Auto-delete activity logs older than 30 days
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
