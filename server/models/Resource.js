const mongoose = require('mongoose');

// ─── Rating sub-document ──────────────────────────────────────────────────────
const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value:  { type: Number, required: true, min: 1, max: 5 },
}, { _id: false });

const resourceSchema = new mongoose.Schema(
  {
    // ─── Core Info ────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Title is required'],
      trim:      true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    thumbnail:   { type: String, default: '' },

    // ─── Classification ───────────────────────────────────────────────────────
    category: {
      type:     mongoose.Schema.Types.Mixed,
      required: [true, 'Category is required'],
    },
    subCategory: { type: String, default: '', trim: true },
    difficulty: {
      type:    String,
      enum:    { values: ['beginner', 'intermediate', 'advanced'], message: '{VALUE} is not valid' },
      default: 'beginner',
    },
    tags:     [{ type: String, trim: true, lowercase: true }],
    language: { type: String, default: 'English', trim: true },

    // ─── Resource Type ────────────────────────────────────────────────────────
    resourceType: {
      type: String,
      enum: {
        values: ['pdf', 'notes', 'video', 'documentation', 'source_code', 'github', 'link', 'presentation', 'ppt', 'pptx', 'word', 'doc', 'docx', 'zip', 'other'],
        message: '{VALUE} is not a valid resource type',
      },
      required: [true, 'Resource type is required'],
    },

    // ─── Content Data & Text Snippets ─────────────────────────────────────────
    fileUrl:         { type: String, default: '' },
    externalUrl:     { type: String, default: '' },
    codeContent:     { type: String, default: '' },
    codeLanguage:    { type: String, default: 'javascript' },
    markdownContent: { type: String, default: '' },
    duration:        { type: Number, default: 0 }, // minutes (for videos)

    // ─── Author / Instructor ──────────────────────────────────────────────────
    uploadedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Uploader is required'],
    },
    instructor: { type: String, default: '', trim: true },

    // ─── Statistics & Discovery ───────────────────────────────────────────────
    views:          { type: Number, default: 0 },
    downloadsCount: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },
    likes:          [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isFeatured:     { type: Boolean, default: false },
    isTrending:     { type: Boolean, default: false },

    // ─── Rating ───────────────────────────────────────────────────────────────
    ratings:       [ratingSchema],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },

    // ─── Comments ─────────────────────────────────────────────────────────────
    comments: [
      {
        userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        fullName:  { type: String, default: 'Developer' },
        avatar:    { type: String, default: '' },
        text:      { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],

    // ─── Access Control ───────────────────────────────────────────────────────
    isPremium: { type: Boolean, default: false },
    version:   { type: String, default: '1.0.0' },
    status: {
      type:    String,
      enum:    ['draft', 'published', 'archived'],
      default: 'published',
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ category: 1 });
resourceSchema.index({ resourceType: 1 });
resourceSchema.index({ difficulty: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ createdAt: -1 });

// ─── Auto-calculate average rating ───────────────────────────────────────────
resourceSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, r) => acc + r.value, 0);
    this.averageRating = parseFloat((sum / this.ratings.length).toFixed(1));
  }
};

module.exports = mongoose.model('Resource', resourceSchema);
