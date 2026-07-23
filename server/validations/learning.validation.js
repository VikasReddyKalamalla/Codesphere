// ─── Learning Path Validation Rules ──────────────────────────────────────────
// These are used as reference for API documentation and manual validation.
// Full schema validation can be plugged in via Joi if needed.

const createPathRules = {
  title:       { required: true,  type: 'string',  maxLength: 100 },
  description: { required: false, type: 'string',  maxLength: 1000 },
  category:    { required: true,  type: 'string' },
  difficulty:  { required: false, type: 'string',  enum: ['beginner', 'intermediate', 'advanced'] },
  thumbnail:   { required: false, type: 'string' },
  isPremium:   { required: false, type: 'boolean' },
};

const updatePathRules = {
  title:       { required: false, type: 'string', maxLength: 100 },
  description: { required: false, type: 'string', maxLength: 1000 },
  category:    { required: false, type: 'string' },
  difficulty:  { required: false, type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
  thumbnail:   { required: false, type: 'string' },
  isPremium:   { required: false, type: 'boolean' },
  isPublished: { required: false, type: 'boolean' },
};

module.exports = { createPathRules, updatePathRules };
