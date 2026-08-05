const mongoose = require('mongoose');

const announcementNotificationSchema = new mongoose.Schema(
  {
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
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ['Update', 'Release', 'Maintenance', 'Community', 'Security'],
      default: 'Update',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    icon: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    mediaUrl: {
      type: String,
      default: '',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    repostsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    // Who this announcement targets
    targetAudience: {
      type: String,
      required: true,
      enum: ['All', 'Students', 'Instructors'],
      default: 'All',
      index: true,
    },
    // IDs of individual notifications spawned from this announcement
    notificationIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ['Draft', 'Scheduled', 'Sent', 'Cancelled'],
      default: 'Sent',
      index: true,
    },
    scheduledAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

announcementNotificationSchema.index({ createdBy: 1, createdAt: -1 });
announcementNotificationSchema.index({ isPinned: -1, createdAt: -1 });

const AnnouncementNotification = mongoose.model(
  'AnnouncementNotification',
  announcementNotificationSchema
);

module.exports = AnnouncementNotification;
