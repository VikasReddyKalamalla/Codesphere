const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    expertise: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    yearsOfExperience: {
      type: Number,
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
    specialization: [
      {
        type: String,
        trim: true,
        maxlength: 100,
      },
    ],
    education: [
      {
        degree: { type: String, trim: true, maxlength: 200 },
        institution: { type: String, trim: true, maxlength: 200 },
        year: { type: Number, min: 1950, max: 2100 },
      },
    ],
    certifications: [
      {
        name: { type: String, trim: true, maxlength: 200 },
        issuer: { type: String, trim: true, maxlength: 200 },
        year: { type: Number, min: 1950, max: 2100 },
        url: { type: String, trim: true, maxlength: 500 },
      },
    ],
    portfolioUrl: {
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
    websiteUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    profileImage: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    // Computed metrics
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
      index: true,
    },
    totalCourses: {
      type: Number,
      default: 0,
    },
    totalSandboxProjects: {
      type: Number,
      default: 0,
    },
    totalLiveSessions: {
      type: Number,
      default: 0,
    },
    totalEvents: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    totalCertificatesIssued: {
      type: Number,
      default: 0,
    },
    // Administrative
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active',
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    adminRemarks: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
instructorSchema.index({ 'skills': 1 });
instructorSchema.index({ 'specialization': 1 });
instructorSchema.index({ rating: -1, totalStudents: -1 });
instructorSchema.index({ createdAt: -1 });

// Virtual for full profile (populates user data)
instructorSchema.virtual('fullProfile').get(function () {
  return {
    ...this.toObject(),
    user: this.user,
  };
});

// Method to update rating
instructorSchema.methods.updateRating = async function (newRating) {
  this.totalRatings += 1;
  this.rating = ((this.rating * (this.totalRatings - 1)) + newRating) / this.totalRatings;
  return this.save();
};

// Static method to increment student count
instructorSchema.statics.incrementStudentCount = function (instructorId) {
  return this.findByIdAndUpdate(
    instructorId,
    { $inc: { totalStudents: 1 } },
    { new: true }
  );
};

// Static method to increment course count
instructorSchema.statics.incrementCourseCount = function (instructorId) {
  return this.findByIdAndUpdate(
    instructorId,
    { $inc: { totalCourses: 1 } },
    { new: true }
  );
};

const Instructor = mongoose.model('Instructor', instructorSchema);

module.exports = Instructor;
