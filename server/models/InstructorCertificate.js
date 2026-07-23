const mongoose = require('mongoose');
const crypto = require('crypto');

const instructorCertificateSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // What the certificate is for
    referenceType: {
      type: String,
      required: true,
      enum: ['LearningPath', 'LiveSession', 'Event', 'Sandbox', 'Assessment'],
      index: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    referenceTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    // Unique certificate identifier for verification
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => `CERT-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
    },
    grade: {
      type: String,
      trim: true,
      maxlength: 10,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    revokedAt: {
      type: Date,
    },
    revokeReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['Active', 'Revoked'],
      default: 'Active',
      index: true,
    },
    certificateUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// certificateNumber index is covered by unique:true on the field definition above
instructorCertificateSchema.index({ instructor: 1, student: 1, referenceId: 1 });

const InstructorCertificate = mongoose.model(
  'InstructorCertificate',
  instructorCertificateSchema
);

module.exports = InstructorCertificate;
