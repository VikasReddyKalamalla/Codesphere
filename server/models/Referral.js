const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema(
  {
    referrerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    referredUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'rewarded'],
      default: 'pending',
    },
    rewardAmount: { type: Number, default: 250 }, // Credits or cash back in INR
    rewardClaimed: { type: Boolean, default: false },
    claimedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Referral', referralSchema);
