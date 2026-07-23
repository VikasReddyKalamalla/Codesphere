// ─── Question Validation Rules ────────────────────────────────────────────────

const createQuestionRules = {
  testId:              { required: true,  type: 'objectId' },
  questionTitle:       { required: true,  type: 'string', maxLength: 500 },
  questionDescription: { required: false, type: 'string', maxLength: 5000 },
  questionType:        { required: false, type: 'string', enum: ['mcq', 'true_false', 'fill_blank', 'short_answer', 'long_answer', 'coding', 'system_design'] },
  options:             { required: false, type: 'array' },
  correctAnswer:       { required: false, type: 'string' },
  difficulty:          { required: false, type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
  technology:          { required: false, type: 'string' },
  tags:                { required: false, type: 'array' },
  marks:               { required: false, type: 'number', min: 0 },
  negativeMarks:       { required: false, type: 'number', min: 0 },
  explanation:         { required: false, type: 'string' },
  hints:               { required: false, type: 'array' },
  codeSnippet:         { required: false, type: 'string' },
  orderIndex:          { required: false, type: 'number', min: 0 },
};

const updateQuestionRules = {
  questionTitle:       { required: false, type: 'string', maxLength: 500 },
  questionDescription: { required: false, type: 'string', maxLength: 5000 },
  questionType:        { required: false, type: 'string', enum: ['mcq', 'true_false', 'fill_blank', 'short_answer', 'long_answer', 'coding', 'system_design'] },
  options:             { required: false, type: 'array' },
  correctAnswer:       { required: false, type: 'string' },
  difficulty:          { required: false, type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
  technology:          { required: false, type: 'string' },
  tags:                { required: false, type: 'array' },
  marks:               { required: false, type: 'number', min: 0 },
  negativeMarks:       { required: false, type: 'number', min: 0 },
  explanation:         { required: false, type: 'string' },
  hints:               { required: false, type: 'array' },
  codeSnippet:         { required: false, type: 'string' },
  orderIndex:          { required: false, type: 'number', min: 0 },
};

module.exports = { createQuestionRules, updateQuestionRules };
