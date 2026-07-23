const mongoose = require('mongoose');

const instructorApplicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expertiseArea: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    professionalBio: {
      type: String,
      required: true,
      trim: true,
      minlength: 100,
      maxlength: 2000,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
    },
    skills: [
      {
        type: String,
        trim: true,
        maxlength: 50,
      },
    ],
    resumeUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    portfolioUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    sampleContentUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    githubUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    linkedinUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    adminRemarks: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Only one active (Pending) application per user at a time
instructorApplicationSchema.index(
  { applicant: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'Pending' },
  }
);

const InstructorApplication = mongoose.model(
  'InstructorApplication',
  instructorApplicationSchema
);

module.exports = InstructorApplication;
