// ─── Milestone Validation Rules ───────────────────────────────────────────────

const createMilestoneRules = {
  workspaceId: { required: true,  type: 'objectId' },
  title:       { required: true,  type: 'string', maxLength: 150 },
  description: { required: false, type: 'string', maxLength: 1000 },
  dueDate:     { required: false, type: 'date' },
  status:      { required: false, type: 'string', enum: ['not_started', 'in_progress', 'completed'] },
};

const updateMilestoneRules = {
  title:       { required: false, type: 'string', maxLength: 150 },
  description: { required: false, type: 'string', maxLength: 1000 },
  dueDate:     { required: false, type: 'date' },
  status:      { required: false, type: 'string', enum: ['not_started', 'in_progress', 'completed'] },
};

module.exports = { createMilestoneRules, updateMilestoneRules };
