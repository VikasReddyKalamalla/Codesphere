const mongoose = require('mongoose');

const sessionFeedbackSchema = new mongoose.Schema(
  {
    sessionId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'LiveSession',
      required: true,
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    rating: {
      type:     Number,
      required: [true, 'Rating is required'],
      min:      1,
      max:      5,
    },
    review:      { type: String, default: '', maxlength: 1000 },
    suggestions: { type: String, default: '', maxlength: 500 },
    issueReport: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true }
);

// One feedback per user per session
sessionFeedbackSchema.index({ sessionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('SessionFeedback', sessionFeedbackSchema);
