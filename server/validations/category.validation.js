const createCategoryRules = {
  name:        { required: true,  type: 'string', maxLength: 50 },
  description: { required: false, type: 'string', maxLength: 200 },
  icon:        { required: false, type: 'string' },
  color:       { required: false, type: 'string' },
};

module.exports = { createCategoryRules };
