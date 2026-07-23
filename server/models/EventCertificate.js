const mongoose = require('mongoose');

const eventCertificateSchema = new mongoose.Schema(
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

    // ─── Certificate Details ──────────────────────────────────────────────────
    certificateType: {
      type:    String,
      enum:    ['participation', 'winner', 'mentor', 'organizer'],
      default: 'participation',
    },
    certificateUrl: { type: String, default: '' },
    certificateId:  { type: String, unique: true, sparse: true },

    // ─── Achievement ──────────────────────────────────────────────────────────
    rank:         { type: Number, default: null },
    prize:        { type: String, default: '' },
    achievements: [{ type: String, trim: true }],

    // ─── Issuance ─────────────────────────────────────────────────────────────
    issuedAt: { type: Date, default: Date.now },
    issuedBy: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'User',
      default: null,
    },
  },
  { timestamps: true }
);

// ─── Auto-generate certificate ID before save ────────────────────────────────
eventCertificateSchema.pre('save', function () {
  if (!this.certificateId) {
    const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
    this.certificateId = `CERT-${Date.now()}-${randomStr}`;
  }
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
eventCertificateSchema.index({ eventId: 1, userId: 1, certificateType: 1 });
eventCertificateSchema.index({ userId: 1, issuedAt: -1 });
// certificateId already has unique index from schema field declaration

module.exports = mongoose.model('EventCertificate', eventCertificateSchema);
