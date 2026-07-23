const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema(
  {
    // ─── Core Info ────────────────────────────────────────────────────────────
    name: {
      type:     String,
      enum:     ['free', 'student_pro', 'professional', 'team', 'enterprise', 'university', 'corporate', 'lifetime', 'standard', 'premium'],
      unique:   true,
      required: [true, 'Plan name is required'],
    },
    displayName: { type: String, required: [true, 'Display name is required'], trim: true },
    description: { type: String, default: '', maxlength: [500, 'Description cannot exceed 500 characters'] },
    tagline:     { type: String, default: '', maxlength: [100, 'Tagline cannot exceed 100 characters'] },

    // ─── Pricing & Currencies ──────────────────────────────────────────────────
    monthlyPrice:   { type: Number, default: 0, min: 0 },   // INR
    quarterlyPrice: { type: Number, default: 0, min: 0 },   // INR
    yearlyPrice:    { type: Number, default: 0, min: 0 },   // INR
    usdMonthlyPrice:{ type: Number, default: 0, min: 0 },   // USD
    usdYearlyPrice: { type: Number, default: 0, min: 0 },   // USD
    currency:       { type: String, default: 'INR' },
    discountPercentage: { type: Number, default: 0 },

    // ─── Feature Limits & Quotas ──────────────────────────────────────────────
    limits: {
      sandboxMinutes:  { type: Number, default: 60 },   // -1 = unlimited
      aiCredits:       { type: Number, default: 50 },   // -1 = unlimited
      storageGB:       { type: Number, default: 1 },    // -1 = unlimited
      downloadsPerMonth: { type: Number, default: 5 },  // -1 = unlimited
      maxWorkspaces:   { type: Number, default: 3 },
      maxTeamSeats:    { type: Number, default: 1 },
      liveSessionsLimit: { type: Number, default: 2 },
    },

    // ─── Feature Flags ────────────────────────────────────────────────────────
    features: {
      learningPaths:       { type: Number,  default: 5 },        // -1 = unlimited
      resources:           { type: Boolean, default: false },
      createCommunities:   { type: Boolean, default: false },
      joinSessions:        { type: Boolean, default: false },
      codexAccess:         { type: Boolean, default: false },
      privateCodex:        { type: Boolean, default: false },
      sandboxAccess:       { type: Boolean, default: false },
      advancedSandbox:     { type: Boolean, default: false },
      testsAccess:         { type: Boolean, default: false },
      analyticsAccess:     { type: Boolean, default: false },
      advancedAnalytics:   { type: Boolean, default: false },
      eventRegistration:   { type: Boolean, default: false },
      aiRoadmap:           { type: Boolean, default: false },
      privatesCommunities: { type: Boolean, default: false },
      prioritySupport:     { type: Boolean, default: false },
      apiAccess:           { type: Boolean, default: false },
      customBranding:      { type: Boolean, default: false },
      ssoSupport:          { type: Boolean, default: false },
      dedicatedAccountManager: { type: Boolean, default: false },
    },

    // ─── Meta ─────────────────────────────────────────────────────────────────
    isActive:    { type: Boolean, default: true },
    isFeatured:  { type: Boolean, default: false },
    sortOrder:   { type: Number,  default: 0 },
    badge:       { type: String, default: '' }, // e.g. "Most Popular", "Best Value"
  },
  { timestamps: true }
);

subscriptionPlanSchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
