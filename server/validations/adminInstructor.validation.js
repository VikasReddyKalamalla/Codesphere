// ─── Admin Instructor Management Validation Rules ─────────────────────────────

const reviewApplicationRules = {
  adminRemarks: { required: false, type: 'string', maxLength: 1000 },
};

const suspendInstructorRules = {
  reason: { required: false, type: 'string', maxLength: 500 },
};

module.exports = { reviewApplicationRules, suspendInstructorRules };
