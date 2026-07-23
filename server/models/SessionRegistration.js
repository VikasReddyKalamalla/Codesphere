const mongoose = require('mongoose');

const sessionRegistrationSchema = new mongoose.Schema(
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
    status: {
      type:    String,
      enum:    ['registered', 'waitlisted', 'cancelled'],
      default: 'registered',
    },
    cancelledAt:   { type: Date, default: null },
    cancelReason:  { type: String, default: '' },
  },
  { timestamps: true }
);

// One registration per user per session
sessionRegistrationSchema.index({ sessionId: 1, userId: 1 }, { unique: true });
sessionRegistrationSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('SessionRegistration', sessionRegistrationSchema);
