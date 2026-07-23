const UserSubscription = require('../models/UserSubscription');
const SubscriptionPlan = require('../models/SubscriptionPlan');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── CHECK FEATURE ACCESS ─────────────────────────────────────────────────────
const checkAccess = async (userId, featureName) => {
  const subscription = await UserSubscription.findOne({ userId, status: 'active' }).populate('planId');

  if (!subscription) {
    // Default to free plan features
    const freePlan = await SubscriptionPlan.findOne({ name: 'free' });
    return {
      hasAccess: freePlan && freePlan.features[featureName] ? true : false,
      plan:      'free',
      feature:   featureName,
    };
  }

  const features = subscription.planId.features || {};
  const hasAccess = features[featureName] === true || features[featureName] > 0;

  return {
    hasAccess,
    plan:    subscription.planName,
    feature: featureName,
    limit:   features[featureName],
  };
};

// ─── GET ALL FEATURES FOR USER ────────────────────────────────────────────────
const getMyFeatures = async (userId) => {
  const subscription = await UserSubscription.findOne({ userId, status: 'active' }).populate('planId');

  if (!subscription) {
    const freePlan = await SubscriptionPlan.findOne({ name: 'free' });
    return {
      plan:     'free',
      features: freePlan ? freePlan.features : {},
    };
  }

  return {
    plan:     subscription.planName,
    features: subscription.planId.features || {},
  };
};

module.exports = { checkAccess, getMyFeatures };
