// ─── Sandbox Submission Validation Rules ─────────────────────────────────────

const submitProjectRules = {
  submissionType: { required: true,  type: 'string', enum: ['github', 'zip', 'live_demo'] },
  githubUrl:      { required: false, type: 'string' },
  zipFileUrl:     { required: false, type: 'string' },
  liveDemoUrl:    { required: false, type: 'string' },
  notes:          { required: false, type: 'string', maxLength: 2000 },
};

const reviewSubmissionRules = {
  status:      { required: true,  type: 'string', enum: ['approved', 'rejected'] },
  reviewNotes: { required: false, type: 'string' },
};

module.exports = { submitProjectRules, reviewSubmissionRules };
