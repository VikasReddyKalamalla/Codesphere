const createSessionRules = {
  title:       { required: true,  type: 'string', maxLength: 150 },
  description: { required: false, type: 'string', maxLength: 2000 },
  agenda:      { required: false, type: 'string', maxLength: 3000 },
  category:    { required: false, type: 'string' },
  difficulty:  { required: false, type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
  startTime:   { required: true,  type: 'date' },
  endTime:     { required: true,  type: 'date' },
  maxCapacity: { required: false, type: 'number', min: 1 },
  community:   { required: false, type: 'ObjectId' },
  isPremium:   { required: false, type: 'boolean' },
  tags:        { required: false, type: 'array' },
};

module.exports = { createSessionRules };
