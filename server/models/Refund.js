const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSubscription' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'processed'],
      default: 'requested',
    },
    transactionReference: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Refund', refundSchema);
