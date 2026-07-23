const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
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
      default:  null,
    },
    invoiceId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Invoice',
      default:  null,
    },

    // ─── Transaction Info ─────────────────────────────────────────────────────
    transactionId: {
      type:   String,
      unique: true,
      sparse: true,
    },
    amount:        { type: Number, default: 0, min: 0 },
    currency:      { type: String, default: 'INR' },
    paymentMethod: {
      type:    String,
      enum:    ['mock', 'upi', 'card', 'netbanking', 'wallet'],
      default: 'mock',
    },

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    { values: ['pending', 'completed', 'failed', 'refunded'], message: '{VALUE} is not a valid status' },
      default: 'completed',
    },
    paidAt:     { type: Date, default: Date.now },
    failReason: { type: String, default: '' },

    // ─── Gateway (future) ─────────────────────────────────────────────────────
    gatewayName:    { type: String, default: 'mock' },
    gatewayOrderId: { type: String, default: '' },
    gatewayPayload: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// ─── Auto-generate mock transactionId before save ─────────────────────────────
paymentSchema.pre('save', function () {
  if (!this.transactionId) {
    this.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
paymentSchema.index({ userId: 1, paidAt: -1 });
paymentSchema.index({ subscriptionId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
