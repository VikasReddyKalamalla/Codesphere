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
    slug: {
      type:      String,
      trim:      true,
      lowercase: true,
      index:     true,
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
      index:   true,
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
      index:    true,
    },
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // ─── Channels (Enterprise Community Architecture) ────────────────────────
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
    defaultChannel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
    channelCategories: [
      {
        name:  { type: String, trim: true },
        order: { type: Number, default: 0 },
      },
    ],

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
      index:   true,
    },

    // ─── Enterprise Settings & Invites ────────────────────────────────────────
    inviteCode: {
      type:    String,
      trim:    true,
      unique:  true,
      sparse:  true,
    },
    settings: {
      allowMemberInvites: { type: Boolean, default: true },
      defaultMemberRole:  { type: String, default: 'member' },
      slowModeSeconds:    { type: Number, default: 0 },
    },

    // ─── Statistics ───────────────────────────────────────────────────────────
    memberCount:  { type: Number, default: 0 },
    postCount:    { type: Number, default: 0 },
    viewCount:    { type: Number, default: 0 },
    messageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
communitySchema.index({ name: 'text', description: 'text', tags: 'text' });
communitySchema.index({ category: 1 });
communitySchema.index({ owner: 1 });
communitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Community', communitySchema);
