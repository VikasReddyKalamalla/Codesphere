// Downloads are tracked via URL params only — no request body needed.
const downloadRules = {
  resourceId: { required: true, source: 'params', type: 'ObjectId' },
};

module.exports = { downloadRules };
