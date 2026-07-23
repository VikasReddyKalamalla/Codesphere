const mongoose = require('mongoose');

const billingHistorySchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User ID is required'],
    },
    subscriptionId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'UserSubscription',
      required: [true, 'Subscription ID is required'],
    },
    planId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'SubscriptionPlan',
      required: [true, 'Plan ID is required'],
    },

    // ─── Billing Info ─────────────────────────────────────────────────────────
    billingType: {
      type:    String,
      enum:    ['subscription', 'renewal', 'upgrade', 'downgrade', 'refund'],
      default: 'subscription',
    },
    planName:     { type: String, default: '' },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    amount:       { type: Number, default: 0 },
    tax:          { type: Number, default: 0 },
    discount:     { type: Number, default: 0 },
    total:        { type: Number, default: 0 },
    currency:     { type: String, default: 'INR' },

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    { values: ['pending', 'paid', 'cancelled', 'refunded', 'expired'], message: '{VALUE} is not a valid status' },
      default: 'paid',
    },

    // ─── Period ───────────────────────────────────────────────────────────────
    periodStart: { type: Date, default: null },
    periodEnd:   { type: Date, default: null },
    billingDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
billingHistorySchema.index({ userId: 1, billingDate: -1 });
billingHistorySchema.index({ subscriptionId: 1 });
billingHistorySchema.index({ status: 1 });

module.exports = mongoose.model('BillingHistory', billingHistorySchema);
