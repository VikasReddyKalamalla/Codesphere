const mongoose = require('mongoose');

const sessionReminderSchema = new mongoose.Schema(
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
    reminderType: {
      type:    String,
      enum:    ['24h', '1h', '15min', 'custom'],
      default: '1h',
    },
    remindAt:   { type: Date, required: true },  // calculated from session startTime
    isSent:     { type: Boolean, default: false },
    sentAt:     { type: Date, default: null },
  },
  { timestamps: true }
);

sessionReminderSchema.index({ sessionId: 1, userId: 1, reminderType: 1 });
sessionReminderSchema.index({ remindAt: 1, isSent: 1 }); // for background job queries

module.exports = mongoose.model('SessionReminder', sessionReminderSchema);
