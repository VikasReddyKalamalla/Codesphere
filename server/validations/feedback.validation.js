const submitFeedbackRules = {
  rating:      { required: true,  type: 'number', min: 1, max: 5 },
  review:      { required: false, type: 'string', maxLength: 1000 },
  suggestions: { required: false, type: 'string', maxLength: 500 },
  issueReport: { required: false, type: 'string', maxLength: 500 },
};

module.exports = { submitFeedbackRules };
