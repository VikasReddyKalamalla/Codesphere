// ─── Question Category Validation Rules ──────────────────────────────────────

const createCategoryRules = {
  name:        { required: true,  type: 'string', maxLength: 80 },
  description: { required: false, type: 'string', maxLength: 500 },
  icon:        { required: false, type: 'string' },
  color:       { required: false, type: 'string' },
};

const updateCategoryRules = {
  name:        { required: false, type: 'string', maxLength: 80 },
  description: { required: false, type: 'string', maxLength: 500 },
  icon:        { required: false, type: 'string' },
  color:       { required: false, type: 'string' },
  isActive:    { required: false, type: 'boolean' },
};

module.exports = { createCategoryRules, updateCategoryRules };
