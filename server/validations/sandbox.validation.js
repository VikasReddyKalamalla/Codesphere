// ─── Sandbox Project Validation Rules ────────────────────────────────────────

const createSandboxRules = {
  title:             { required: true,  type: 'string', maxLength: 200 },
  description:       { required: false, type: 'string', maxLength: 5000 },
  difficulty:        { required: false, type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
  category:          { required: false, type: 'string', enum: ['frontend', 'backend', 'fullstack', 'ai_ml', 'devops', 'cybersecurity', 'mobile', 'blockchain', 'cloud'] },
  technologyStack:   { required: false, type: 'array' },
  prerequisites:     { required: false, type: 'array' },
  learningOutcomes:  { required: false, type: 'array' },
  tags:              { required: false, type: 'array' },
  thumbnail:         { required: false, type: 'string' },
  bannerImage:       { required: false, type: 'string' },
  sourceCodeUrl:     { required: false, type: 'string' },
  demoUrl:           { required: false, type: 'string' },
  estimatedDuration: { required: false, type: 'string' },
  estimatedMinutes:  { required: false, type: 'number', min: 0 },
};

const updateSandboxRules = {
  title:             { required: false, type: 'string', maxLength: 200 },
  description:       { required: false, type: 'string', maxLength: 5000 },
  difficulty:        { required: false, type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
  category:          { required: false, type: 'string', enum: ['frontend', 'backend', 'fullstack', 'ai_ml', 'devops', 'cybersecurity', 'mobile', 'blockchain', 'cloud'] },
  technologyStack:   { required: false, type: 'array' },
  prerequisites:     { required: false, type: 'array' },
  learningOutcomes:  { required: false, type: 'array' },
  tags:              { required: false, type: 'array' },
  thumbnail:         { required: false, type: 'string' },
  bannerImage:       { required: false, type: 'string' },
  sourceCodeUrl:     { required: false, type: 'string' },
  demoUrl:           { required: false, type: 'string' },
  estimatedDuration: { required: false, type: 'string' },
  estimatedMinutes:  { required: false, type: 'number', min: 0 },
  status:            { required: false, type: 'string', enum: ['draft', 'published', 'archived'] },
  isFeatured:        { required: false, type: 'boolean' },
};

module.exports = { createSandboxRules, updateSandboxRules };
