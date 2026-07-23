const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User ID is required'],
    },
    billingId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'BillingHistory',
      required: [true, 'Billing ID is required'],
    },
    subscriptionId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'UserSubscription',
      default:  null,
    },

    // ─── Invoice Info ─────────────────────────────────────────────────────────
    invoiceNumber: {
      type:   String,
      unique: true,
      trim:   true,
    },
    planName:     { type: String, default: '' },
    billingCycle: { type: String, default: 'monthly' },
    amount:       { type: Number, default: 0 },
    tax:          { type: Number, default: 0 },
    discount:     { type: Number, default: 0 },
    total:        { type: Number, default: 0 },
    currency:     { type: String, default: 'INR' },

    // ─── Payment ──────────────────────────────────────────────────────────────
    paymentMethod: { type: String, default: 'mock' },

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    { values: ['pending', 'paid', 'cancelled', 'refunded'], message: '{VALUE} is not a valid status' },
      default: 'paid',
    },
    invoiceDate: { type: Date, default: Date.now },
    paidAt:      { type: Date, default: null },
  },
  { timestamps: true }
);

// ─── Auto-generate invoice number before save ─────────────────────────────────
invoiceSchema.pre('save', function () {
  if (!this.invoiceNumber) {
    const pad = (n) => String(n).padStart(6, '0');
    this.invoiceNumber = `INV-${Date.now()}-${pad(Math.floor(Math.random() * 999999))}`;
  }
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
// invoiceNumber already has unique index from schema field declaration
invoiceSchema.index({ userId: 1, invoiceDate: -1 });
invoiceSchema.index({ billingId: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
