const mongoose = require('mongoose');

const dsaTopicSchema = new mongoose.Schema(
  {
    // ─── Core Info ────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Topic title is required'],
      trim:      true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type:   String,
      unique: true,
      trim:   true,
      lowercase: true,
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    icon: { type: String, default: '📦' }, // emoji or icon name
    color: { type: String, default: '#6366f1' }, // hex color for theming

    // ─── Ordering & Sequential Unlock ─────────────────────────────────────────
    order: {
      type:     Number,
      required: [true, 'Topic order is required'],
      min:      [1, 'Order must be at least 1'],
    },
    unlockThreshold: {
      type:    Number,
      default: 60, // % of previous topic problems needed to unlock this one
      min:     0,
      max:     100,
    },

    // ─── Classification ───────────────────────────────────────────────────────
    difficulty: {
      type:    String,
      enum:    { values: ['beginner', 'intermediate', 'advanced'], message: '{VALUE} is not valid' },
      default: 'beginner',
    },
    estimatedHours: { type: Number, default: 0 },

    // ─── Learning Content ─────────────────────────────────────────────────────
    introduction:    { type: String, default: '' },   // markdown
    whyItMatters:    { type: String, default: '' },   // markdown
    cheatSheet:      { type: String, default: '' },   // markdown
    commonMistakes:  { type: String, default: '' },   // markdown
    complexityTable: { type: String, default: '' },   // markdown

    // ─── Metadata ─────────────────────────────────────────────────────────────
    interviewCompanies: [{ type: String, trim: true }],
    prerequisites:      [{ type: String, trim: true }], // topic slugs

    // ─── Stats (auto-calculated) ──────────────────────────────────────────────
    totalProblems: { type: Number, default: 0 },

    // ─── Status ───────────────────────────────────────────────────────────────
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ─── Auto-generate slug ───────────────────────────────────────────────────────
dsaTopicSchema.pre('save', function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
dsaTopicSchema.index({ order: 1 });
dsaTopicSchema.index({ slug: 1 }, { unique: true });
dsaTopicSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('DSATopic', dsaTopicSchema);
