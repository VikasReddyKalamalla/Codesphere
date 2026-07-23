const createResourceRules = {
  title:        { required: true,  type: 'string',  maxLength: 150 },
  description:  { required: false, type: 'string',  maxLength: 2000 },
  category:     { required: true,  type: 'ObjectId' },
  subCategory:  { required: false, type: 'string' },
  difficulty:   { required: false, type: 'string',  enum: ['beginner', 'intermediate', 'advanced'] },
  resourceType: { required: true,  type: 'string',  enum: ['pdf','notes','video','documentation','source_code','github','link','presentation','zip','other'] },
  fileUrl:      { required: false, type: 'string' },
  externalUrl:  { required: false, type: 'string' },
  tags:         { required: false, type: 'array' },
  language:     { required: false, type: 'string' },
  isPremium:    { required: false, type: 'boolean' },
};

const updateResourceRules = {
  title:        { required: false, type: 'string',  maxLength: 150 },
  description:  { required: false, type: 'string',  maxLength: 2000 },
  subCategory:  { required: false, type: 'string' },
  difficulty:   { required: false, type: 'string' },
  tags:         { required: false, type: 'array' },
  status:       { required: false, type: 'string',  enum: ['draft', 'published', 'archived'] },
  isPremium:    { required: false, type: 'boolean' },
};

module.exports = { createResourceRules, updateResourceRules };
