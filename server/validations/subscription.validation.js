// ─── Subscription Validation Rules ───────────────────────────────────────────

const createSubscriptionRules = {
  planName:     { required: true,  type: 'string', enum: ['standard', 'premium'] },
  billingCycle: { required: false, type: 'string', enum: ['monthly', 'yearly'] },
};

const upgradeDowngradeRules = {
  planName: { required: true, type: 'string', enum: ['free', 'standard', 'premium'] },
};

const cancelSubscriptionRules = {
  reason: { required: false, type: 'string', maxLength: 500 },
};

module.exports = { createSubscriptionRules, upgradeDowngradeRules, cancelSubscriptionRules };
