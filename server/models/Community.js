const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema(
  {
    // ─── Core Info ────────────────────────────────────────────────────────────
    name: {
      type:      String,
      required:  [true, 'Community name is required'],
      trim:      true,
      unique:    true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type:    String,
      default: 'General',
      trim:    true,
    },
    rules: {
      type:    String,
      default: '',
      maxlength: [2000, 'Rules cannot exceed 2000 characters'],
    },

    // ─── Media ────────────────────────────────────────────────────────────────
    logo:   { type: String, default: '' },
    banner: { type: String, default: '' },

    // ─── Ownership & Members ──────────────────────────────────────────────────
    owner: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Owner is required'],
    },
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // ─── Content References ───────────────────────────────────────────────────
    posts:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    pinnedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

    // ─── Tags ─────────────────────────────────────────────────────────────────
    tags: [{ type: String, trim: true, lowercase: true }],

    // ─── Visibility & Status ──────────────────────────────────────────────────
    visibility: {
      type:    String,
      enum:    ['public', 'private'],
      default: 'public',
    },
    status: {
      type:    String,
      enum:    ['active', 'archived'],
      default: 'active',
    },

    // ─── Statistics ───────────────────────────────────────────────────────────
    memberCount: { type: Number, default: 0 },
    postCount:   { type: Number, default: 0 },
    viewCount:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
communitySchema.index({ name: 'text', description: 'text', tags: 'text' });
communitySchema.index({ category: 1 });
communitySchema.index({ owner: 1 });
communitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Community', communitySchema);
