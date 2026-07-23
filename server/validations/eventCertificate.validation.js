// ─── Event Certificate Validation Rules ──────────────────────────────────────

const issueCertificateRules = {
  userId:          { required: true,  type: 'objectId' },
  certificateType: { required: false, type: 'string', enum: ['participation', 'winner', 'mentor', 'organizer'] },
  certificateUrl:  { required: false, type: 'string' },
  rank:            { required: false, type: 'number', min: 1 },
  prize:           { required: false, type: 'string' },
  achievements:    { required: false, type: 'array' },
};

module.exports = { issueCertificateRules };
