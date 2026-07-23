const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Post',
      required: [true, 'Post reference is required'],
    },
    author: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Author is required'],
    },
    content: {
      type:      String,
      required:  [true, 'Comment content is required'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },

    // ─── Nested Reply Support ─────────────────────────────────────────────────
    parentComment: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Comment',
      default: null,
    },

    // ─── Interactions ─────────────────────────────────────────────────────────
    likes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likeCount: { type: Number, default: 0 },

    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ author: 1 });

module.exports = mongoose.model('Comment', commentSchema);
