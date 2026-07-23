// ─── Instructor Profile Validation Rules ─────────────────────────────────────

const updateProfileRules = {
  bio:               { required: false, type: 'string', maxLength: 2000 },
  expertise:         { required: false, type: 'string', maxLength: 200 },
  yearsOfExperience: { required: false, type: 'number', min: 0, max: 50 },
  skills:            { required: false, type: 'array' },
  specialization:    { required: false, type: 'array' },
  education:         { required: false, type: 'array' },
  certifications:    { required: false, type: 'array' },
  portfolioUrl:      { required: false, type: 'string', maxLength: 500 },
  githubUrl:         { required: false, type: 'string', maxLength: 500 },
  linkedinUrl:       { required: false, type: 'string', maxLength: 500 },
  websiteUrl:        { required: false, type: 'string', maxLength: 500 },
  profileImage:      { required: false, type: 'string', maxLength: 500 },
};

const getInstructorsRules = {
  search:         { required: false, type: 'string', maxLength: 200 },
  skill:          { required: false, type: 'string', maxLength: 100 },
  specialization: { required: false, type: 'string', maxLength: 100 },
  sort:           { required: false, type: 'string', enum: ['newest', 'oldest', 'highest-rated', 'most-students', 'popular'] },
  page:           { required: false, type: 'number', min: 1 },
  limit:          { required: false, type: 'number', min: 1, max: 100 },
};

module.exports = {
  updateProfileRules,
  getInstructorsRules,
};
