// ─── Task Comment Validation Rules ────────────────────────────────────────────

const addCommentRules = {
  content:       { required: true,  type: 'string', maxLength: 2000 },
  parentComment: { required: false, type: 'objectId' },
};

const editCommentRules = {
  content: { required: true, type: 'string', maxLength: 2000 },
};

module.exports = { addCommentRules, editCommentRules };
