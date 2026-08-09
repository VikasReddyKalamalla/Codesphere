const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema(
  {
    // ─── Core Info ────────────────────────────────────────────────────────────
    name: {
      type:      String,
      required:  [true, 'Workspace name is required'],
      trim:      true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    slug: {
      type:   String,
      unique: true,
      trim:   true,
    },

    // ─── Ownership ────────────────────────────────────────────────────────────
    owner: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Owner is required'],
    },

    // ─── Visibility & Status ──────────────────────────────────────────────────
    visibility: {
      type:    String,
      enum:    { values: ['public', 'private', 'invite_only'], message: '{VALUE} is not a valid visibility' },
      default: 'private',
    },
    status: {
      type:    String,
      enum:    { values: ['planning', 'active', 'on_hold', 'completed', 'archived'], message: '{VALUE} is not a valid status' },
      default: 'planning',
    },

    // ─── Media ────────────────────────────────────────────────────────────────
    logo:        { type: String, default: '' },
    bannerImage: { type: String, default: '' },

    // ─── Tech & Links ─────────────────────────────────────────────────────────
    technologyStack: [{ type: String, trim: true }],
    framework:       { type: String, default: '' },
    database:        { type: String, default: '' },
    deployment:      { type: String, default: '' },
    githubRepo:      { type: String, default: '' },
    liveUrl:         { type: String, default: '' },
    tags:            [{ type: String, trim: true, lowercase: true }],

    // ─── Statistics ───────────────────────────────────────────────────────────
    memberCount:       { type: Number, default: 1 },
    taskCount:         { type: Number, default: 0 },
    completedTaskCount:{ type: Number, default: 0 },
    milestoneCount:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Auto-generate slug before save ──────────────────────────────────────────
workspaceSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      + '-' + Date.now();
  }
  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
workspaceSchema.index({ owner: 1 });
workspaceSchema.index({ status: 1 });
workspaceSchema.index({ visibility: 1 });
workspaceSchema.index({ createdAt: -1 });
workspaceSchema.index({ name: 'text', description: 'text', tags: 'text', technologyStack: 'text' });

module.exports = mongoose.model('Workspace', workspaceSchema, 'workspaces');
