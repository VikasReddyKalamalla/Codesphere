// ─── Instructor Analytics Validation Rules ────────────────────────────────────

const getAnalyticsRules = {
  months: { required: false, type: 'number', min: 1, max: 36 },
};

module.exports = { getAnalyticsRules };
