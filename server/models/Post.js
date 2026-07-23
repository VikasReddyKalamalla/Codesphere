const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    // ─── Parent Community ─────────────────────────────────────────────────────
    communityId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Community',
      required: [true, 'Community is required'],
    },

    // ─── Author ───────────────────────────────────────────────────────────────
    author: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Author is required'],
    },

    // ─── Content ──────────────────────────────────────────────────────────────
    title: {
      type:      String,
      trim:      true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      default:   '',
    },
    content: {
      type:      String,
      required:  [true, 'Content is required'],
      maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },

    // ─── Media ────────────────────────────────────────────────────────────────
    images:      [{ type: String }],
    videos:      [{ type: String }],
    attachments: [{ type: String }],

    // ─── Interactions ─────────────────────────────────────────────────────────
    likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

    // ─── Stats ────────────────────────────────────────────────────────────────
    views:         { type: Number, default: 0 },
    likeCount:     { type: Number, default: 0 },
    commentCount:  { type: Number, default: 0 },
    bookmarkCount: { type: Number, default: 0 },

    // ─── Flags ────────────────────────────────────────────────────────────────
    isPinned:   { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
postSchema.index({ communityId: 1, createdAt: -1 });
postSchema.index({ author: 1 });
postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
