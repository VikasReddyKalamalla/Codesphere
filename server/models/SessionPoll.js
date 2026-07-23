const mongoose = require('mongoose');

const pollVoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  optionIndex: {
    type: Number,
    required: true,
  },
}, { _id: false, timestamps: true });

const sessionPollSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiveSession',
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: [true, 'Poll question is required'],
      trim: true,
    },
    options: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    isClosed: {
      type: Boolean,
      default: false,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    votes: [pollVoteSchema],
  },
  { timestamps: true }
);

sessionPollSchema.index({ sessionId: 1, createdAt: -1 });

module.exports = mongoose.model('SessionPoll', sessionPollSchema);
