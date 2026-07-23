// ─── Module Validation Rules ─────────────────────────────────────────────────

const createModuleRules = {
  learningPathId: { required: true,  type: 'ObjectId' },
  title:          { required: true,  type: 'string', maxLength: 100 },
  description:    { required: false, type: 'string', maxLength: 500 },
  order:          { required: true,  type: 'number', min: 1 },
};

const updateModuleRules = {
  title:       { required: false, type: 'string', maxLength: 100 },
  description: { required: false, type: 'string', maxLength: 500 },
  order:       { required: false, type: 'number', min: 1 },
};

module.exports = { createModuleRules, updateModuleRules };
