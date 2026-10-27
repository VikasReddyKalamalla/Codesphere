const mongoose = require('mongoose');

const directChatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      trim: true,
      maxlength: [100, 'Group name cannot exceed 100 characters'],
    },
    groupAvatar: {
      type: String,
      default: '',
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastMessage: {
      content: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      senderName: String,
      timestamp: Date,
      isRead: {
        type: Boolean,
        default: false,
      },
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
    mutedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

directChatSchema.index({ participants: 1 });
directChatSchema.index({ updatedAt: -1 });

const DirectChat = mongoose.model('DirectChat', directChatSchema);

module.exports = DirectChat;
