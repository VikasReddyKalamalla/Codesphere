const mongoose = require('mongoose');

const quizAnswerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true,
  },
  selectedOptionIndex: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SessionQuiz',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    answers: [quizAnswerSchema],
  },
  { timestamps: true }
);

// One attempt per user per quiz
quizAttemptSchema.index({ quizId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
