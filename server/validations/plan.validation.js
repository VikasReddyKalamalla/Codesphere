// ─── Subscription Plan Validation Rules ──────────────────────────────────────

const createPlanRules = {
  name:         { required: true,  type: 'string', enum: ['free', 'standard', 'premium'] },
  displayName:  { required: true,  type: 'string', maxLength: 50 },
  description:  { required: false, type: 'string', maxLength: 500 },
  tagline:      { required: false, type: 'string', maxLength: 100 },
  monthlyPrice: { required: false, type: 'number', min: 0 },
  yearlyPrice:  { required: false, type: 'number', min: 0 },
  features:     { required: false, type: 'object' },
  sortOrder:    { required: false, type: 'number' },
  badge:        { required: false, type: 'string' },
};

const updatePlanRules = {
  displayName:  { required: false, type: 'string', maxLength: 50 },
  description:  { required: false, type: 'string', maxLength: 500 },
  tagline:      { required: false, type: 'string', maxLength: 100 },
  monthlyPrice: { required: false, type: 'number', min: 0 },
  yearlyPrice:  { required: false, type: 'number', min: 0 },
  features:     { required: false, type: 'object' },
  sortOrder:    { required: false, type: 'number' },
  badge:        { required: false, type: 'string' },
  isActive:     { required: false, type: 'boolean' },
  isFeatured:   { required: false, type: 'boolean' },
};

module.exports = { createPlanRules, updatePlanRules };
