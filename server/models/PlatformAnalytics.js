const mongoose = require('mongoose');

const platformAnalyticsSchema = new mongoose.Schema(
  {
    // Period in YYYY-MM format (one snapshot per month)
    period: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/,
    },
    // User stats
    users: {
      total: { type: Number, default: 0 },
      active: { type: Number, default: 0 },
      newThisMonth: { type: Number, default: 0 },
      premium: { type: Number, default: 0 },
      instructors: { type: Number, default: 0 },
      growthRate: { type: Number, default: 0 },
    },
    // Content stats
    content: {
      learningPaths: { type: Number, default: 0 },
      resources: { type: Number, default: 0 },
      communities: { type: Number, default: 0 },
      events: { type: Number, default: 0 },
      sandboxProjects: { type: Number, default: 0 },
      liveSessions: { type: Number, default: 0 },
      tests: { type: Number, default: 0 },
      workspaces: { type: Number, default: 0 },
    },
    // Engagement stats
    engagement: {
      totalEnrollments: { type: Number, default: 0 },
      completedCourses: { type: Number, default: 0 },
      testAttempts: { type: Number, default: 0 },
      sessionAttendees: { type: Number, default: 0 },
      eventRegistrations: { type: Number, default: 0 },
      sandboxCompletions: { type: Number, default: 0 },
    },
    // Revenue stats
    revenue: {
      total: { type: Number, default: 0 },
      standardPlan: { type: Number, default: 0 },
      premiumPlan: { type: Number, default: 0 },
      growthRate: { type: Number, default: 0 },
    },
    // Reports / moderation
    moderation: {
      reportsFiled: { type: Number, default: 0 },
      reportsResolved: { type: Number, default: 0 },
      contentRemoved: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

platformAnalyticsSchema.index({ period: -1 });

const PlatformAnalytics = mongoose.model('PlatformAnalytics', platformAnalyticsSchema);

module.exports = PlatformAnalytics;
