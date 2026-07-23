// ─── Dashboard Validation Rules ──────────────────────────────────────────────
// Dashboard APIs do not accept request bodies (all are GET endpoints).
// All data is derived from req.user._id set by auth middleware.
// This file is a placeholder for consistency with other modules.

const dashboardRules = {
  description: 'All dashboard endpoints are GET requests and require authentication.',
  note:        'No request body validation needed — data is aggregated server-side.',
};

module.exports = { dashboardRules };
