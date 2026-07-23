const mongoose = require('mongoose');

const notificationPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    // Global toggle – if false, no notifications are delivered
    enabled: {
      type: Boolean,
      default: true,
    },
    // Per-category preferences
    categories: {
      Learning: {
        type: Boolean,
        default: true,
      },
      Resources: {
        type: Boolean,
        default: true,
      },
      Community: {
        type: Boolean,
        default: true,
      },
      'Live Session': {
        type: Boolean,
        default: true,
      },
      Event: {
        type: Boolean,
        default: true,
      },
      Codex: {
        type: Boolean,
        default: true,
      },
      Sandbox: {
        type: Boolean,
        default: true,
      },
      Assessment: {
        type: Boolean,
        default: true,
      },
      Subscription: {
        type: Boolean,
        default: true,
      },
      Instructor: {
        type: Boolean,
        default: true,
      },
      Admin: {
        type: Boolean,
        default: true,
      },
      System: {
        type: Boolean,
        default: true,
      },
    },
    // Per-channel preferences (for future integrations)
    channels: {
      inApp: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: false,
      },
      push: {
        type: Boolean,
        default: false,
      },
    },
    // Marketing and announcement opt-ins
    marketingNotifications: {
      type: Boolean,
      default: true,
    },
    announcements: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationPreference = mongoose.model(
  'NotificationPreference',
  notificationPreferenceSchema
);

module.exports = NotificationPreference;
