// ─── Sandbox Template Validation Rules ───────────────────────────────────────

const createTemplateRules = {
  projectId:    { required: true,  type: 'objectId' },
  title:        { required: true,  type: 'string', maxLength: 150 },
  description:  { required: false, type: 'string', maxLength: 500 },
  templateType: { required: false, type: 'string', enum: ['starter', 'completed', 'assets', 'documentation'] },
  fileUrl:      { required: true,  type: 'string' },
  fileSize:     { required: false, type: 'number', min: 0 },
};

module.exports = { createTemplateRules };
