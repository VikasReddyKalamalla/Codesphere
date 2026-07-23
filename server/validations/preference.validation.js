// ─── Notification Preference Validation Rules ─────────────────────────────────

const updatePreferenceRules = {
  enabled:                { required: false, type: 'boolean' },
  marketingNotifications: { required: false, type: 'boolean' },
  announcements:          { required: false, type: 'boolean' },
  // Category toggles (nested under categories.*)
  'categories.Learning':      { required: false, type: 'boolean' },
  'categories.Resources':     { required: false, type: 'boolean' },
  'categories.Community':     { required: false, type: 'boolean' },
  'categories.Live Session':  { required: false, type: 'boolean' },
  'categories.Event':         { required: false, type: 'boolean' },
  'categories.Codex':         { required: false, type: 'boolean' },
  'categories.Sandbox':       { required: false, type: 'boolean' },
  'categories.Assessment':    { required: false, type: 'boolean' },
  'categories.Subscription':  { required: false, type: 'boolean' },
  'categories.Instructor':    { required: false, type: 'boolean' },
  'categories.Admin':         { required: false, type: 'boolean' },
  'categories.System':        { required: false, type: 'boolean' },
  // Channel toggles (for future integrations)
  'channels.inApp':  { required: false, type: 'boolean' },
  'channels.email':  { required: false, type: 'boolean' },
  'channels.push':   { required: false, type: 'boolean' },
};

module.exports = { updatePreferenceRules };
