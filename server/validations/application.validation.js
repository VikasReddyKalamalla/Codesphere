// ─── Instructor Application Validation Rules ──────────────────────────────────

const submitApplicationRules = {
  expertiseArea:      { required: true,  type: 'string', maxLength: 200 },
  professionalBio:    { required: true,  type: 'string', minLength: 100, maxLength: 2000 },
  yearsOfExperience:  { required: true,  type: 'number', min: 0, max: 50 },
  skills:             { required: false, type: 'array' },
  resumeUrl:          { required: false, type: 'string', maxLength: 500 },
  portfolioUrl:       { required: false, type: 'string', maxLength: 500 },
  sampleContentUrl:   { required: false, type: 'string', maxLength: 500 },
  githubUrl:          { required: false, type: 'string', maxLength: 500 },
  linkedinUrl:        { required: false, type: 'string', maxLength: 500 },
};

const updateApplicationRules = {
  expertiseArea:      { required: false, type: 'string', maxLength: 200 },
  professionalBio:    { required: false, type: 'string', minLength: 100, maxLength: 2000 },
  yearsOfExperience:  { required: false, type: 'number', min: 0, max: 50 },
  skills:             { required: false, type: 'array' },
  resumeUrl:          { required: false, type: 'string', maxLength: 500 },
  portfolioUrl:       { required: false, type: 'string', maxLength: 500 },
  sampleContentUrl:   { required: false, type: 'string', maxLength: 500 },
  githubUrl:          { required: false, type: 'string', maxLength: 500 },
  linkedinUrl:        { required: false, type: 'string', maxLength: 500 },
};

const reviewApplicationRules = {
  status:        { required: true,  type: 'string', enum: ['Approved', 'Rejected'] },
  adminRemarks:  { required: false, type: 'string', maxLength: 1000 },
};

module.exports = {
  submitApplicationRules,
  updateApplicationRules,
  reviewApplicationRules,
};
