// ─── Platform Settings Validation Rules ──────────────────────────────────────

const updateSettingsRules = {
  platformName:           { required: false, type: 'string', maxLength: 100 },
  platformDescription:    { required: false, type: 'string', maxLength: 500 },
  registrationEnabled:    { required: false, type: 'boolean' },
  maintenanceMode:        { required: false, type: 'boolean' },
  maintenanceMessage:     { required: false, type: 'string', maxLength: 500 },
  maxUploadSize:          { required: false, type: 'number', min: 0 },
  defaultTheme:           { required: false, type: 'string', enum: ['light', 'dark', 'auto'] },
  defaultLanguage:        { required: false, type: 'string', maxLength: 10 },
  contactEmail:           { required: false, type: 'string', maxLength: 100 },
};

module.exports = { updateSettingsRules };
