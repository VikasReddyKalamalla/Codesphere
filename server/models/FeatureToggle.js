const mongoose = require('mongoose');

const featureToggleSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // snake_case keys e.g. "enable_sandbox", "enable_community"
      maxlength: 100,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    module: {
      type: String,
      required: true,
      enum: [
        'Learning',
        'Resources',
        'Community',
        'Events',
        'LiveSessions',
        'Codex',
        'Sandbox',
        'Tests',
        'Notifications',
        'Instructor',
        'Analytics',
        'Admin',
      ],
      index: true,
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Rollout percentage (0-100) for gradual feature releases
    rolloutPercent: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    // Environment restriction
    environment: {
      type: String,
      enum: ['all', 'development', 'production'],
      default: 'all',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const FeatureToggle = mongoose.model('FeatureToggle', featureToggleSchema);

module.exports = FeatureToggle;
