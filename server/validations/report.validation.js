const createReportRules = {
  targetType:  { required: true, type: 'string', enum: ['post', 'comment', 'community'] },
  targetId:    { required: true, type: 'ObjectId' },
  reason:      { required: true, type: 'string', enum: ['spam','abuse','harassment','fake_information','inappropriate_content','other'] },
  description: { required: false, type: 'string', maxLength: 500 },
};

module.exports = { createReportRules };
