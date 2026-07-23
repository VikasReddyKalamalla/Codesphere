// ─── Workspace Validation Rules ───────────────────────────────────────────────

const createWorkspaceRules = {
  name:             { required: true,  type: 'string', maxLength: 150 },
  description:      { required: false, type: 'string', maxLength: 2000 },
  visibility:       { required: false, type: 'string', enum: ['public', 'private'] },
  status:           { required: false, type: 'string', enum: ['planning', 'active', 'on_hold', 'completed', 'archived'] },
  technologyStack:  { required: false, type: 'array' },
  githubRepo:       { required: false, type: 'string' },
  liveUrl:          { required: false, type: 'string' },
  tags:             { required: false, type: 'array' },
  logo:             { required: false, type: 'string' },
  bannerImage:      { required: false, type: 'string' },
};

const updateWorkspaceRules = {
  name:             { required: false, type: 'string', maxLength: 150 },
  description:      { required: false, type: 'string', maxLength: 2000 },
  visibility:       { required: false, type: 'string', enum: ['public', 'private'] },
  status:           { required: false, type: 'string', enum: ['planning', 'active', 'on_hold', 'completed', 'archived'] },
  technologyStack:  { required: false, type: 'array' },
  githubRepo:       { required: false, type: 'string' },
  liveUrl:          { required: false, type: 'string' },
  tags:             { required: false, type: 'array' },
  logo:             { required: false, type: 'string' },
  bannerImage:      { required: false, type: 'string' },
};

module.exports = { createWorkspaceRules, updateWorkspaceRules };
