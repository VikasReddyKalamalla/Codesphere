const createCommunityRules = {
  name:        { required: true,  type: 'string', maxLength: 100 },
  description: { required: false, type: 'string', maxLength: 1000 },
  category:    { required: false, type: 'string' },
  rules:       { required: false, type: 'string', maxLength: 2000 },
  visibility:  { required: false, type: 'string', enum: ['public', 'private'] },
  tags:        { required: false, type: 'array' },
};

module.exports = { createCommunityRules };
