// ─── Event Category Validation Rules ─────────────────────────────────────────

const createEventCategoryRules = {
  name:        { required: true,  type: 'string', maxLength: 80 },
  description: { required: false, type: 'string', maxLength: 500 },
  icon:        { required: false, type: 'string' },
  color:       { required: false, type: 'string' },
};

const updateEventCategoryRules = {
  name:        { required: false, type: 'string', maxLength: 80 },
  description: { required: false, type: 'string', maxLength: 500 },
  icon:        { required: false, type: 'string' },
  color:       { required: false, type: 'string' },
  isActive:    { required: false, type: 'boolean' },
};

module.exports = { createEventCategoryRules, updateEventCategoryRules };
