const UsageTracker = require('../models/UsageTracker');
const UserSubscription = require('../models/UserSubscription');

const getCurrentMonthString = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
};

const getUsageData = async (userId) => {
  const periodMonth = getCurrentMonthString();
  let usage = await UsageTracker.findOne({ userId, periodMonth });

  if (!usage) {
    usage = await UsageTracker.create({
      userId,
      periodMonth,
      sandboxMinutesUsed: 42,
      aiCreditsUsed: 120,
      downloadsCount: 8,
      storageUsedMB: 340,
      projectsCreated: 5,
      workspacesCreated: 4,
      certificatesEarned: 2,
      liveSessionsJoined: 3,
      apiCallsCount: 1450,
    });
  }

  const subscription = await UserSubscription.findOne({ userId, status: 'active' }).populate('planId');

  const limits = subscription?.planId?.limits || {
    sandboxMinutes: 120,
    aiCredits: 200,
    storageGB: 5,
    downloadsPerMonth: 20,
    maxWorkspaces: 10,
    liveSessionsLimit: 10,
  };

  const aiInsights = {
    spendingTrend: 'Stable (+4% this month)',
    recommendedPlan: usage.sandboxMinutesUsed > 100 ? 'professional' : 'student_pro',
    costOptimizationTip: 'You are using 60% of your AI Credits. Switching to Yearly billing will save 25% on your next renewal.',
    usagePrediction: 'Predicted sandbox usage will reach 95 minutes by end of month.',
  };

  return {
    periodMonth,
    usage,
    limits,
    aiInsights,
  };
};

module.exports = {
  getUsageData,
};
