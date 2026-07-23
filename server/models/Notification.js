const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Learning',
        'Resources',
        'Community',
        'Live Session',
        'Event',
        'Codex',
        'Sandbox',
        'Assessment',
        'Subscription',
        'Instructor',
        'Admin',
        'System',
      ],
      index: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Information', 'Success', 'Warning', 'Error', 'Reminder', 'Announcement'],
      default: 'Information',
    },
    icon: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    referenceModule: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    status: {
      type: String,
      required: true,
      enum: ['Unread', 'Read', 'Archived', 'Deleted'],
      default: 'Unread',
      index: true,
    },
    readAt: {
      type: Date,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NotificationTemplate',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, category: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, priority: 1, createdAt: -1 });

// Virtual for time since creation
notificationSchema.virtual('timeAgo').get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Method to mark as read
notificationSchema.methods.markAsRead = function () {
  this.status = 'Read';
  this.readAt = new Date();
  return this.save();
};

// Method to mark as unread
notificationSchema.methods.markAsUnread = function () {
  this.status = 'Unread';
  this.readAt = null;
  return this.save();
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ recipient: userId, status: 'Unread' });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = function (userId) {
  return this.updateMany(
    { recipient: userId, status: 'Unread' },
    { status: 'Read', readAt: new Date() }
  );
};

// Static method to clear all notifications
notificationSchema.statics.clearAllNotifications = function (userId) {
  return this.updateMany(
    { recipient: userId },
    { status: 'Deleted' }
  );
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
