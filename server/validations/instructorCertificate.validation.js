// ─── Instructor Certificate Validation Rules ──────────────────────────────────

const REFERENCE_TYPES = ['LearningPath', 'LiveSession', 'Event', 'Sandbox', 'Assessment'];

const issueCertificateRules = {
  studentId:      { required: true,  type: 'objectId' },
  referenceType:  { required: true,  type: 'string', enum: REFERENCE_TYPES },
  referenceId:    { required: true,  type: 'objectId' },
  referenceTitle: { required: true,  type: 'string', maxLength: 300 },
  grade:          { required: false, type: 'string', maxLength: 10 },
  score:          { required: false, type: 'number', min: 0, max: 100 },
  certificateUrl: { required: false, type: 'string', maxLength: 500 },
};

const revokeCertificateRules = {
  revokeReason: { required: false, type: 'string', maxLength: 500 },
};

module.exports = {
  issueCertificateRules,
  revokeCertificateRules,
};
