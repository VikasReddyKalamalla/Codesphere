// ─── Admin User Management Validation Rules ───────────────────────────────────

const updateUserRules = {
  fullName:    { required: false, type: 'string', maxLength: 100 },
  plan:        { required: false, type: 'string', enum: ['free', 'standard', 'premium'] },
  isVerified:  { required: false, type: 'boolean' },
  isActive:    { required: false, type: 'boolean' },
};

const updateUserRoleRules = {
  role: { required: true, type: 'string', enum: ['student', 'instructor', 'admin', 'mentor', 'recruiter', 'organization'] },
};

const suspendUserRules = {
  reason: { required: false, type: 'string', maxLength: 500 },
};

module.exports = { updateUserRules, updateUserRoleRules, suspendUserRules };
