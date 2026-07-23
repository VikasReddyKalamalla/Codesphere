// ─── Test Attempt Validation Rules ───────────────────────────────────────────

const saveAnswerRules = {
  questionId:     { required: true,  type: 'objectId' },
  selectedAnswer: { required: false, type: 'string' },
  timeTaken:      { required: false, type: 'number', min: 0 },
};

module.exports = { saveAnswerRules };
