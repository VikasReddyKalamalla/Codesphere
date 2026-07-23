const createPostRules = {
  communityId: { required: true,  type: 'ObjectId' },
  title:       { required: false, type: 'string', maxLength: 200 },
  content:     { required: true,  type: 'string', maxLength: 10000 },
  images:      { required: false, type: 'array' },
};

module.exports = { createPostRules };
