const mongoose = require('mongoose');

const userSubscriptionSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User ID is required'],
    },
    planId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'SubscriptionPlan',
      required: [true, 'Plan ID is required'],
    },
    planName: {
      type:    String,
      enum:    ['free', 'student_pro', 'professional', 'team', 'enterprise', 'university', 'corporate', 'lifetime', 'standard', 'premium'],
      default: 'free',
    },

    // ─── Billing ──────────────────────────────────────────────────────────────
    billingCycle: {
      type:    String,
      enum:    ['monthly', 'quarterly', 'yearly', 'custom', 'lifetime'],
      default: 'monthly',
    },
    amount:   { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    couponApplied: { type: String, default: '' },
    discountAmount: { type: Number, default: 0 },
    teamSeats: { type: Number, default: 1 },

    // ─── Dates ────────────────────────────────────────────────────────────────
    startDate:   { type: Date, required: [true, 'Start date is required'] },
    endDate:     { type: Date, required: [true, 'End date is required'] },
    renewalDate: { type: Date, default: null },
    trialEndDate:{ type: Date, default: null },

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    ['active', 'inactive', 'paused', 'cancelled', 'expired', 'trial'],
      default: 'active',
    },
    paymentStatus: {
      type:    String,
      enum:    ['pending', 'paid', 'failed', 'refunded'],
      default: 'paid',
    },
    autoRenew:  { type: Boolean, default: true },
    cancelledAt:{ type: Date, default: null },
    cancelReason:{ type: String, default: '' },
    pausedAt:   { type: Date, default: null },

    // ─── Upgrade / Downgrade History ──────────────────────────────────────────
    previousPlan: { type: String, default: null },
    changedAt:    { type: Date, default: null },
  },
  { timestamps: true }
);

userSubscriptionSchema.index({ userId: 1, status: 1 });
userSubscriptionSchema.index({ endDate: 1, status: 1 });

module.exports = mongoose.model('UserSubscription', userSubscriptionSchema);
