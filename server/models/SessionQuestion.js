const mongoose = require('mongoose');

const sessionQuestionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiveSession',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionText: {
      type: String,
      required: [true, 'Question content is required'],
      maxlength: [1000, 'Question cannot exceed 1000 characters'],
      trim: true,
    },
    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isAnswered: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

sessionQuestionSchema.index({ sessionId: 1, isPinned: -1, createdAt: -1 });

module.exports = mongoose.model('SessionQuestion', sessionQuestionSchema);
