const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  selectedAnswer: { type: String },
});

const submissionSchema = new mongoose.Schema(
  {
    testId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers:     [answerSchema],
    score:       { type: Number, default: 0 },
    rank:        { type: Number, default: null },
    submittedAt: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model('Submission', submissionSchema);
