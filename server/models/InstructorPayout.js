const mongoose = require('mongoose');

const instructorPayoutSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    grossEarnings: {
      type: Number,
      required: true,
      min: 0,
    },
    revenueSharePercentage: {
      type: Number,
      default: 70, // 70% to instructor, 30% platform fee
      min: 0,
      max: 100,
    },
    netPayout: {
      type: Number,
      required: true,
      min: 0,
    },
    payoutMethod: {
      type: String,
      enum: ['Bank_Transfer', 'PayPal', 'Stripe_Connect', 'UPI'],
      default: 'Bank_Transfer',
    },
    paymentDetails: {
      accountNumber: { type: String, trim: true },
      routingNumber: { type: String, trim: true },
      paypalEmail: { type: String, trim: true },
      upiId: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Processed', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    transactionReference: {
      type: String,
      trim: true,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    processedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

instructorPayoutSchema.index({ instructor: 1, createdAt: -1 });

const InstructorPayout = mongoose.model('InstructorPayout', instructorPayoutSchema);

module.exports = InstructorPayout;
