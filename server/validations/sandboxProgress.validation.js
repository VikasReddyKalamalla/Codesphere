// ─── Sandbox Progress Validation Rules ───────────────────────────────────────

const updateProgressRules = {
  stepNumber: { required: true, type: 'number', min: 1 },
  unmark:     { required: false, type: 'boolean' },
};

module.exports = { updateProgressRules };
