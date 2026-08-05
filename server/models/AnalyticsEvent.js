const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      index: true,
      // e.g. 'user_signup', 'user_login', 'payment_success', 'codex_execution', 'test_submitted', 'session_joined', 'system_alert'
    },
    category: {
      type: String,
      enum: ['user', 'payment', 'codex', 'test', 'session', 'system', 'course'],
      default: 'system',
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    userName: {
      type: String,
      default: 'System',
    },
    userRole: {
      type: String,
      default: 'student',
    },
    avatar: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['success', 'warning', 'info', 'error'],
      default: 'info',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    country: {
      type: String,
      default: 'US',
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

analyticsEventSchema.index({ timestamp: -1 });
analyticsEventSchema.index({ category: 1, timestamp: -1 });

// Auto-expire raw granular events after 90 days to conserve storage
analyticsEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);

module.exports = AnalyticsEvent;
