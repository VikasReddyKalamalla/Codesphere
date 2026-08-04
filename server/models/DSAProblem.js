const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  input:       { type: String, required: true },
  output:      { type: String, required: true },
  explanation: { type: String, default: '' },
}, { _id: false });

const testCaseSchema = new mongoose.Schema({
  input:          { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden:       { type: Boolean, default: false },
  explanation:    { type: String, default: '' },
}, { _id: false });

const resourceSchema = new mongoose.Schema({
  type:  { type: String, enum: ['article', 'video', 'reference', 'visual'], default: 'article' },
  title: { type: String, required: true },
  url:   { type: String, default: '' },
  description: { type: String, default: '' },
}, { _id: false });

const dsaProblemSchema = new mongoose.Schema(
  {
    // ─── Core Info ────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Problem title is required'],
      trim:      true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type:   String,
      unique: true,
      trim:   true,
      lowercase: true,
    },
    difficulty: {
      type:     String,
      enum:     { values: ['easy', 'medium', 'hard'], message: '{VALUE} is not valid' },
      required: [true, 'Difficulty is required'],
    },

    // ─── Problem Statement ────────────────────────────────────────────────────
    statement:   { type: String, required: [true, 'Statement is required'] }, // markdown
    constraints: { type: String, default: '' },   // markdown
    inputFormat: { type: String, default: '' },
    outputFormat:{ type: String, default: '' },
    examples:    [exampleSchema],

    // ─── Hints (Progressive) ──────────────────────────────────────────────────
    hints: [{ type: String }], // array of strings, revealed one by one

    // ─── Editorial ────────────────────────────────────────────────────────────
    editorial: { type: String, default: '' }, // markdown — locked until solved

    // ─── Classification ───────────────────────────────────────────────────────
    tags:      [{ type: String, trim: true, lowercase: true }],
    patterns:  [{ type: String, trim: true, lowercase: true }], // sliding-window, two-pointer, etc.
    companies: [{ type: String, trim: true }],

    // ─── Metadata ─────────────────────────────────────────────────────────────
    estimatedTime:  { type: Number, default: 20 },    // minutes
    acceptanceRate: { type: Number, default: 50 },     // percentage

    // ─── Starter Code ─────────────────────────────────────────────────────────
    starterCode: {
      type: mongoose.Schema.Types.Mixed,
      default: {}, // { java: "...", python: "...", javascript: "...", cpp: "..." }
    },

    // ─── Test Cases ───────────────────────────────────────────────────────────
    testCases: [testCaseSchema],

    // ─── Resources ────────────────────────────────────────────────────────────
    resources: [resourceSchema],

    // ─── Relations ────────────────────────────────────────────────────────────
    topicId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'DSATopic',
      required: [true, 'Topic reference is required'],
    },
    sectionId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'DSASection',
      default: null,
    },
    order: {
      type:    Number,
      default: 1,
    },

    // ─── Status ───────────────────────────────────────────────────────────────
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ─── Auto-generate slug ───────────────────────────────────────────────────────
dsaProblemSchema.pre('save', function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
dsaProblemSchema.index({ slug: 1 }, { unique: true });
dsaProblemSchema.index({ topicId: 1, order: 1 });
dsaProblemSchema.index({ sectionId: 1 });
dsaProblemSchema.index({ difficulty: 1 });
dsaProblemSchema.index({ title: 'text', tags: 'text', companies: 'text', patterns: 'text' });

module.exports = mongoose.model('DSAProblem', dsaProblemSchema);
