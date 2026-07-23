const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema(
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

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    ['registered', 'waitlisted', 'cancelled', 'attended'],
      default: 'registered',
    },

    // ─── Timestamps ───────────────────────────────────────────────────────────
    registeredAt: { type: Date, default: Date.now },
    cancelledAt:  { type: Date, default: null },

    // ─── Meta ─────────────────────────────────────────────────────────────────
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
eventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
eventRegistrationSchema.index({ userId: 1, status: 1 });
eventRegistrationSchema.index({ eventId: 1, status: 1 });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
