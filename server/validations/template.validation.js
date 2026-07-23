// ─── Notification Template Validation Rules ───────────────────────────────────

const CATEGORIES = [
  'Learning', 'Resources', 'Community', 'Live Session', 'Event',
  'Codex', 'Sandbox', 'Assessment', 'Subscription', 'Instructor', 'Admin', 'System',
];

const TYPES = ['Information', 'Success', 'Warning', 'Error', 'Reminder', 'Announcement'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const createTemplateRules = {
  name:            { required: true,  type: 'string', maxLength: 100 },
  description:     { required: false, type: 'string', maxLength: 500 },
  titleTemplate:   { required: true,  type: 'string', maxLength: 200 },
  messageTemplate: { required: true,  type: 'string', maxLength: 1000 },
  category:        { required: true,  type: 'string', enum: CATEGORIES },
  type:            { required: false, type: 'string', enum: TYPES },
  priority:        { required: false, type: 'string', enum: PRIORITIES },
  icon:            { required: false, type: 'string', maxLength: 100 },
  variables:       { required: false, type: 'array' },
  isActive:        { required: false, type: 'boolean' },
};

const updateTemplateRules = {
  name:            { required: false, type: 'string', maxLength: 100 },
  description:     { required: false, type: 'string', maxLength: 500 },
  titleTemplate:   { required: false, type: 'string', maxLength: 200 },
  messageTemplate: { required: false, type: 'string', maxLength: 1000 },
  category:        { required: false, type: 'string', enum: CATEGORIES },
  type:            { required: false, type: 'string', enum: TYPES },
  priority:        { required: false, type: 'string', enum: PRIORITIES },
  icon:            { required: false, type: 'string', maxLength: 100 },
  variables:       { required: false, type: 'array' },
  isActive:        { required: false, type: 'boolean' },
};

module.exports = {
  createTemplateRules,
  updateTemplateRules,
};
