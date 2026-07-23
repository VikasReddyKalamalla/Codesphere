// ─── Sandbox Step Validation Rules ───────────────────────────────────────────

const createStepRules = {
  projectId:     { required: true,  type: 'objectId' },
  stepNumber:    { required: true,  type: 'number', min: 1 },
  title:         { required: true,  type: 'string', maxLength: 200 },
  description:   { required: false, type: 'string', maxLength: 10000 },
  objectives:    { required: false, type: 'array' },
  instructions:  { required: false, type: 'string' },
  resources:     { required: false, type: 'array' },
  estimatedTime: { required: false, type: 'string' },
  isOptional:    { required: false, type: 'boolean' },
};

const updateStepRules = {
  stepNumber:    { required: false, type: 'number', min: 1 },
  title:         { required: false, type: 'string', maxLength: 200 },
  description:   { required: false, type: 'string', maxLength: 10000 },
  objectives:    { required: false, type: 'array' },
  instructions:  { required: false, type: 'string' },
  resources:     { required: false, type: 'array' },
  estimatedTime: { required: false, type: 'string' },
  isOptional:    { required: false, type: 'boolean' },
};

const reorderStepsRules = {
  orderedIds: { required: true, type: 'array' },
};

module.exports = { createStepRules, updateStepRules, reorderStepsRules };
