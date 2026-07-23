// ─── Admin Report Validation Rules ───────────────────────────────────────────

const updateReportRules = {
  status:     { required: false, type: 'string', enum: ['reviewed', 'resolved', 'dismissed'] },
  adminNotes: { required: false, type: 'string', maxLength: 1000 },
};

module.exports = { updateReportRules };
