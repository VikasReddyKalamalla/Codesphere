const addCommentRules = {
  postId:        { required: true,  type: 'ObjectId' },
  content:       { required: true,  type: 'string', maxLength: 2000 },
  parentComment: { required: false, type: 'ObjectId' },
};

module.exports = { addCommentRules };
