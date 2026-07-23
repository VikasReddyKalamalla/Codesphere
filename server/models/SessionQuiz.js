const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  options: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  correctOptionIndex: {
    type: Number,
    required: true,
  },
  durationSeconds: {
    type: Number,
    default: 30,
  },
}, { _id: false });

const sessionQuizSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    questions: [quizQuestionSchema],
    status: {
      type: String,
      enum: ['draft', 'active', 'finished'],
      default: 'draft',
    },
    activeQuestionIndex: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

sessionQuizSchema.index({ sessionId: 1, status: 1 });

module.exports = mongoose.model('SessionQuiz', sessionQuizSchema);
