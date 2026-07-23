// ─── Event Reminder Validation Rules ─────────────────────────────────────────

const createEventReminderRules = {
  reminderType:  { required: false, type: 'string', enum: ['7d', '1d', '1h', 'custom'] },
  customMinutes: { required: false, type: 'number', min: 5 },  // required when reminderType === 'custom'
};

module.exports = { createEventReminderRules };
