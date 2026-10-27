const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema(
  {
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Channel name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    topic: {
      type: String,
      default: '',
      maxlength: [500, 'Topic cannot exceed 500 characters'],
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    type: {
      type: String,
      enum: ['text', 'announcement', 'forum', 'voice'],
      default: 'text',
      index: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    allowedRoles: [
      {
        type: String,
        enum: ['owner', 'admin', 'moderator', 'mentor', 'member'],
      },
    ],
    slowModeSeconds: {
      type: Number,
      default: 0, // 0 = off, 5, 10, 30, etc.
    },
    order: {
      type: Number,
      default: 0,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    lastMessage: {
      content: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      senderName: String,
      timestamp: Date,
    },
    pinnedMessageIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  { timestamps: true }
);

// Unique channel name per community
channelSchema.index({ community: 1, name: 1 }, { unique: true });
channelSchema.index({ community: 1, category: 1, order: 1 });

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
