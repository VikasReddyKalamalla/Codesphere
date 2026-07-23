const mongoose = require('mongoose');

const sessionAnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SessionQuestion',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answerText: {
      type: String,
      required: [true, 'Answer content is required'],
      maxlength: [2000, 'Answer cannot exceed 2000 characters'],
      trim: true,
    },
  },
  { timestamps: true }
);

sessionAnswerSchema.index({ questionId: 1, createdAt: 1 });

module.exports = mongoose.model('SessionAnswer', sessionAnswerSchema);
