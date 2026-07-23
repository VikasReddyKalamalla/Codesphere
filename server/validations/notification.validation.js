// ─── Notification Validation Rules ───────────────────────────────────────────

const CATEGORIES = [
  'Learning', 'Resources', 'Community', 'Live Session', 'Event',
  'Codex', 'Sandbox', 'Assessment', 'Subscription', 'Instructor', 'Admin', 'System',
];

const TYPES = ['Information', 'Success', 'Warning', 'Error', 'Reminder', 'Announcement'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Unread', 'Read', 'Archived', 'Deleted'];

const createNotificationRules = {
  recipient:       { required: true,  type: 'objectId' },
  title:           { required: true,  type: 'string', maxLength: 200 },
  message:         { required: true,  type: 'string', maxLength: 1000 },
  category:        { required: true,  type: 'string', enum: CATEGORIES },
  priority:        { required: false, type: 'string', enum: PRIORITIES },
  type:            { required: false, type: 'string', enum: TYPES },
  icon:            { required: false, type: 'string', maxLength: 100 },
  referenceId:     { required: false, type: 'objectId' },
  referenceModule: { required: false, type: 'string', maxLength: 100 },
  templateId:      { required: false, type: 'objectId' },
};

const getNotificationsRules = {
  status:   { required: false, type: 'string', enum: STATUSES },
  category: { required: false, type: 'string', enum: CATEGORIES },
  priority: { required: false, type: 'string', enum: PRIORITIES },
  type:     { required: false, type: 'string', enum: TYPES },
  search:   { required: false, type: 'string', maxLength: 200 },
  sort:     { required: false, type: 'string', enum: ['newest', 'oldest'] },
  page:     { required: false, type: 'number', min: 1 },
  limit:    { required: false, type: 'number', min: 1, max: 100 },
};

module.exports = {
  createNotificationRules,
  getNotificationsRules,
};
