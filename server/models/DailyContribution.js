const mongoose = require('mongoose');

const dailyContributionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    count: {
      type: Number,
      default: 1,
      min: 0,
    },
  },
  { timestamps: true }
);

// Ensure unique entry per user per day
dailyContributionSchema.index({ user: 1, date: 1 }, { unique: true });
dailyContributionSchema.index({ user: 1, createdAt: -1 });

const DailyContribution = mongoose.model('DailyContribution', dailyContributionSchema);

module.exports = DailyContribution;
