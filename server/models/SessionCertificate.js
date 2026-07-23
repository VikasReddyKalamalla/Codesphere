const mongoose = require('mongoose');

const sessionCertificateSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiveSession',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    certificateUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['attendance', 'completion'],
      default: 'attendance',
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

sessionCertificateSchema.index({ sessionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('SessionCertificate', sessionCertificateSchema);
