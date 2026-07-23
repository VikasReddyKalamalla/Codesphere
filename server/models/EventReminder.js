const mongoose = require('mongoose');

const eventReminderSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    eventId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Event',
      required: [true, 'Event ID is required'],
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User ID is required'],
    },

    // ─── Reminder Config ──────────────────────────────────────────────────────
    reminderType: {
      type:    String,
      enum:    ['7d', '1d', '1h', 'custom'],
      default: '1d',
    },
    customMinutes: { type: Number, default: null },  // used when reminderType === 'custom'
    remindAt:      { type: Date, required: [true, 'Remind at date is required'] },

    // ─── Delivery Status ──────────────────────────────────────────────────────
    isSent: { type: Boolean, default: false },
    sentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
eventReminderSchema.index({ eventId: 1, userId: 1, reminderType: 1 });
eventReminderSchema.index({ remindAt: 1, isSent: 1 }); // for background job queries

module.exports = mongoose.model('EventReminder', eventReminderSchema);
