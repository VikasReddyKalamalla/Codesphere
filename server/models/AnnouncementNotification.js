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
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    icon: {
      type: String,
      trim: true,
      maxlength: 100,
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
      default: 'Draft',
      index: true,
    },
    scheduledAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
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
announcementNotificationSchema.index({ status: 1, scheduledAt: 1 });

const AnnouncementNotification = mongoose.model(
  'AnnouncementNotification',
  announcementNotificationSchema
);

module.exports = AnnouncementNotification;
