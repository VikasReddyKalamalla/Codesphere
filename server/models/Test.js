const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
  {
    // ─── Core Info ────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Test title is required'],
      trim:      true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
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
    category: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'QuestionCategory',
      default: null,
    },
    difficulty: {
      type:    String,
      enum:    { values: ['beginner', 'intermediate', 'advanced', 'expert'], message: '{VALUE} is not a valid difficulty' },
      default: 'beginner',
    },
    technology: { type: String, default: '', trim: true },
    tags:       [{ type: String, trim: true, lowercase: true }],

    // ─── Test Configuration ───────────────────────────────────────────────────
    duration:       { type: Number, required: [true, 'Duration is required'], min: 1 }, // minutes
    passingMarks:   { type: Number, default: 0 },
    totalMarks:     { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    maxAttempts:    { type: Number, default: 1 },   // 0 = unlimited
    negativeMarking: { type: Boolean, default: false },
    negativeMarkValue: { type: Number, default: 0.25 }, // marks deducted per wrong answer

    // ─── Randomization ────────────────────────────────────────────────────────
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions:   { type: Boolean, default: false },

    // ─── Media ────────────────────────────────────────────────────────────────
    thumbnail: { type: String, default: '' },

    // ─── Access ───────────────────────────────────────────────────────────────
    visibility: {
      type:    String,
      enum:    { values: ['public', 'private', 'invite_only'], message: '{VALUE} is not a valid visibility' },
      default: 'public',
    },
    isPremium:   { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    { values: ['draft', 'published', 'archived'], message: '{VALUE} is not a valid status' },
      default: 'draft',
    },

    // ─── Stats ────────────────────────────────────────────────────────────────
    attemptCount:  { type: Number, default: 0 },
    averageScore:  { type: Number, default: 0 },
    bookmarkCount: { type: Number, default: 0 },
    viewCount:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Auto-generate slug before save ──────────────────────────────────────────
testSchema.pre('save', function () {
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
testSchema.index({ instructor: 1 });
testSchema.index({ status: 1, isPublished: 1 });
testSchema.index({ difficulty: 1 });
testSchema.index({ technology: 1 });
testSchema.index({ title: 'text', description: 'text', tags: 'text', technology: 'text' });

module.exports = mongoose.model('Test', testSchema);
