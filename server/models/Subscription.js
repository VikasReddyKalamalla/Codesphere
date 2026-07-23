const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan:         { type: String, enum: ['free', 'pro', 'enterprise'], required: true },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    amount:       { type: Number, default: 0 },
    status:       { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    startDate:    { type: Date, required: true },
    endDate:      { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
