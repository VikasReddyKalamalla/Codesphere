// ─── Task Validation Rules ────────────────────────────────────────────────────

const createTaskRules = {
  workspaceId:    { required: true,  type: 'objectId' },
  title:          { required: true,  type: 'string', maxLength: 200 },
  description:    { required: false, type: 'string', maxLength: 5000 },
  assignedTo:     { required: false, type: 'objectId' },
  milestoneId:    { required: false, type: 'objectId' },
  status:         { required: false, type: 'string', enum: ['backlog', 'todo', 'in_progress', 'review', 'testing', 'completed', 'cancelled'] },
  priority:       { required: false, type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
  labels:         { required: false, type: 'array' },
  dueDate:        { required: false, type: 'date' },
  estimatedHours: { required: false, type: 'number', min: 0 },
  completedHours: { required: false, type: 'number', min: 0 },
};

const updateTaskRules = {
  title:          { required: false, type: 'string', maxLength: 200 },
  description:    { required: false, type: 'string', maxLength: 5000 },
  assignedTo:     { required: false, type: 'objectId' },
  milestoneId:    { required: false, type: 'objectId' },
  status:         { required: false, type: 'string', enum: ['backlog', 'todo', 'in_progress', 'review', 'testing', 'completed', 'cancelled'] },
  priority:       { required: false, type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
  labels:         { required: false, type: 'array' },
  dueDate:        { required: false, type: 'date' },
  estimatedHours: { required: false, type: 'number', min: 0 },
  completedHours: { required: false, type: 'number', min: 0 },
};

module.exports = { createTaskRules, updateTaskRules };
