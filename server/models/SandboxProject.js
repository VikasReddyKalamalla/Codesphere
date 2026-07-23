const mongoose = require('mongoose');

const sandboxProjectSchema = new mongoose.Schema(
  {
    // ─── Core Info ────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Project title is required'],
      trim:      true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    slug: {
      type:   String,
      unique: true,
      trim:   true,
    },

    // ─── Instructor ───────────────────────────────────────────────────────────
    instructor: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Instructor is required'],
    },

    // ─── Classification ───────────────────────────────────────────────────────
    difficulty: {
      type:    String,
      enum:    { values: ['beginner', 'intermediate', 'advanced', 'expert'], message: '{VALUE} is not a valid difficulty' },
      default: 'beginner',
    },
    category: {
      type:    String,
      enum:    {
        values:  ['frontend', 'backend', 'fullstack', 'ai_ml', 'devops', 'cybersecurity', 'mobile', 'blockchain', 'cloud'],
        message: '{VALUE} is not a valid category',
      },
      default: 'fullstack',
    },
    technologyStack:  [{ type: String, trim: true }],
    prerequisites:    [{ type: String, trim: true }],
    learningOutcomes: [{ type: String, trim: true }],
    tags:             [{ type: String, trim: true, lowercase: true }],

    // ─── Media ────────────────────────────────────────────────────────────────
    thumbnail:   { type: String, default: '' },
    bannerImage: { type: String, default: '' },

    // ─── Links ────────────────────────────────────────────────────────────────
    sourceCodeUrl: { type: String, default: '' },
    demoUrl:       { type: String, default: '' },

    // ─── Duration ────────────────────────────────────────────────────────────
    estimatedDuration: { type: String, default: '' }, // e.g. "12 Hours"
    estimatedMinutes:  { type: Number, default: 0 },  // for calculations

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    { values: ['draft', 'published', 'archived'], message: '{VALUE} is not a valid status' },
      default: 'draft',
    },
    isPublished: { type: Boolean, default: false },
    isFeatured:  { type: Boolean, default: false },

    // ─── Stats ────────────────────────────────────────────────────────────────
    stepCount:       { type: Number, default: 0 },
    enrolledCount:   { type: Number, default: 0 },
    completedCount:  { type: Number, default: 0 },
    bookmarkCount:   { type: Number, default: 0 },
    downloadCount:   { type: Number, default: 0 },
    averageRating:   { type: Number, default: 0, min: 0, max: 5 },
    viewCount:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Auto-generate slug before save ──────────────────────────────────────────
sandboxProjectSchema.pre('save', function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      + '-' + Date.now();
  }
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
sandboxProjectSchema.index({ instructor: 1 });
sandboxProjectSchema.index({ status: 1, isPublished: 1 });
sandboxProjectSchema.index({ difficulty: 1 });
sandboxProjectSchema.index({ category: 1 });
sandboxProjectSchema.index({ enrolledCount: -1 });
sandboxProjectSchema.index({ title: 'text', description: 'text', tags: 'text', technologyStack: 'text' });

module.exports = mongoose.model('SandboxProject', sandboxProjectSchema);
