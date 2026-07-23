// ─── Lesson Validation Rules ─────────────────────────────────────────────────

const createLessonRules = {
  moduleId: { required: true,  type: 'ObjectId' },
  title:    { required: true,  type: 'string', maxLength: 100 },
  type:     { required: true,  type: 'string', enum: ['video', 'article', 'code'] },
  videoUrl: { required: false, type: 'string'  },
  article:  { required: false, type: 'string'  },
  code:     { required: false, type: 'string'  },
  duration: { required: false, type: 'number', min: 0 },
  order:    { required: true,  type: 'number', min: 1 },
  isFree:   { required: false, type: 'boolean' },
};

const updateLessonRules = {
  title:    { required: false, type: 'string', maxLength: 100 },
  type:     { required: false, type: 'string', enum: ['video', 'article', 'code'] },
  videoUrl: { required: false, type: 'string' },
  article:  { required: false, type: 'string' },
  code:     { required: false, type: 'string' },
  duration: { required: false, type: 'number', min: 0 },
  order:    { required: false, type: 'number', min: 1 },
  isFree:   { required: false, type: 'boolean' },
};

module.exports = { createLessonRules, updateLessonRules };
