const mongoose = require('mongoose');

const instructorAnalyticsSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true,
      index: true,
    },
    // Snapshot period (YYYY-MM, e.g. "2026-07")
    period: {
      type: String,
      required: true,
      trim: true,
      // Format: YYYY-MM
      match: /^\d{4}-(0[1-9]|1[0-2])$/,
    },
    // Student metrics
    newStudents: {
      type: Number,
      default: 0,
    },
    activeStudents: {
      type: Number,
      default: 0,
    },
    studentGrowthRate: {
      type: Number,
      default: 0,
    },
    // Course metrics
    courseEnrollments: {
      type: Number,
      default: 0,
    },
    courseCompletions: {
      type: Number,
      default: 0,
    },
    averageCourseProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Assessment metrics
    assessmentsAttempted: {
      type: Number,
      default: 0,
    },
    assessmentsPassed: {
      type: Number,
      default: 0,
    },
    averageAssessmentScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Session metrics
    sessionsHosted: {
      type: Number,
      default: 0,
    },
    totalSessionAttendees: {
      type: Number,
      default: 0,
    },
    // Sandbox metrics
    sandboxCompletions: {
      type: Number,
      default: 0,
    },
    // Event metrics
    eventsOrganized: {
      type: Number,
      default: 0,
    },
    eventAttendees: {
      type: Number,
      default: 0,
    },
    // Revenue / engagement
    revenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// One analytics record per instructor per month
instructorAnalyticsSchema.index({ instructor: 1, period: 1 }, { unique: true });

const InstructorAnalytics = mongoose.model('InstructorAnalytics', instructorAnalyticsSchema);

module.exports = InstructorAnalytics;
