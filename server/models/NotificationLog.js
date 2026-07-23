const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema(
  {
    notification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification',
      required: true,
      index: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    deliveryStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Delivered', 'Failed', 'Skipped'],
      default: 'Delivered',
      index: true,
    },
    deliveryChannel: {
      type: String,
      enum: ['In-App', 'Email', 'Push', 'SMS'],
      default: 'In-App',
    },
    readStatus: {
      type: String,
      enum: ['Unread', 'Read'],
      default: 'Unread',
      index: true,
    },
    readAt: {
      type: Date,
    },
    failureReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

notificationLogSchema.index({ recipient: 1, createdAt: -1 });
notificationLogSchema.index({ notification: 1, recipient: 1 });

const NotificationLog = mongoose.model('NotificationLog', notificationLogSchema);

module.exports = NotificationLog;
