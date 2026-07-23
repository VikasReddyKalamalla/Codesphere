const mongoose = require('mongoose');

const typingStatusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    isTyping: {
      type: Boolean,
      default: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    stoppedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// One record per user per room
typingStatusSchema.index({ user: 1, room: 1 }, { unique: true });

// TTL index: auto-delete stale typing records after 30 seconds
typingStatusSchema.index({ startedAt: 1 }, { expireAfterSeconds: 30 });

const TypingStatus = mongoose.model('TypingStatus', typingStatusSchema);

module.exports = TypingStatus;
