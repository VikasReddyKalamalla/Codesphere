// ─── Test Validation Rules ────────────────────────────────────────────────────

const createTestRules = {
  title:             { required: true,  type: 'string', maxLength: 200 },
  description:       { required: false, type: 'string', maxLength: 3000 },
  category:          { required: false, type: 'objectId' },
  difficulty:        { required: false, type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
  technology:        { required: false, type: 'string' },
  tags:              { required: false, type: 'array' },
  duration:          { required: true,  type: 'number', min: 1 },
  passingMarks:      { required: false, type: 'number', min: 0 },
  maxAttempts:       { required: false, type: 'number', min: 0 },
  negativeMarking:   { required: false, type: 'boolean' },
  negativeMarkValue: { required: false, type: 'number', min: 0 },
  shuffleQuestions:  { required: false, type: 'boolean' },
  shuffleOptions:    { required: false, type: 'boolean' },
  visibility:        { required: false, type: 'string', enum: ['public', 'private', 'invite_only'] },
  isPremium:         { required: false, type: 'boolean' },
  thumbnail:         { required: false, type: 'string' },
};

const updateTestRules = {
  title:             { required: false, type: 'string', maxLength: 200 },
  description:       { required: false, type: 'string', maxLength: 3000 },
  category:          { required: false, type: 'objectId' },
  difficulty:        { required: false, type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
  technology:        { required: false, type: 'string' },
  tags:              { required: false, type: 'array' },
  duration:          { required: false, type: 'number', min: 1 },
  passingMarks:      { required: false, type: 'number', min: 0 },
  maxAttempts:       { required: false, type: 'number', min: 0 },
  negativeMarking:   { required: false, type: 'boolean' },
  negativeMarkValue: { required: false, type: 'number', min: 0 },
  shuffleQuestions:  { required: false, type: 'boolean' },
  shuffleOptions:    { required: false, type: 'boolean' },
  visibility:        { required: false, type: 'string', enum: ['public', 'private', 'invite_only'] },
  isPremium:         { required: false, type: 'boolean' },
  thumbnail:         { required: false, type: 'string' },
  status:            { required: false, type: 'string', enum: ['draft', 'published', 'archived'] },
};

module.exports = { createTestRules, updateTestRules };
