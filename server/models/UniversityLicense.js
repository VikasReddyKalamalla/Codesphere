const mongoose = require('mongoose');

const universityLicenseSchema = new mongoose.Schema(
  {
    universityName: { type: String, required: true },
    domain: { type: String, required: true, unique: true }, // e.g., stanford.edu
    contactPerson: { type: String, required: true },
    contactEmail: { type: String, required: true },
    studentCapacity: { type: Number, default: 500 },
    activeStudentsCount: { type: Number, default: 0 },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UniversityLicense', universityLicenseSchema);
