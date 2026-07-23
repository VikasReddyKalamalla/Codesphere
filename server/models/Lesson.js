const mongoose = require('mongoose');

const articleSectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['heading', 'paragraph', 'code', 'list', 'note', 'warning', 'tip'],
    required: true
  },
  content: { type: String, default: '' },
  language: { type: String, default: 'javascript' }, // for code blocks
  items: [{ type: String }], // for list sections
  level: { type: Number, default: 2 } // for headings (h2, h3, etc.)
});

const lessonSchema = new mongoose.Schema(
  {
    // ─── Parent Reference ─────────────────────────────────────────────────────
    moduleId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Module',
      required: [true, 'Module reference is required'],
    },

    // ─── Core Info ────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Lesson title is required'],
      trim:      true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    type: {
      type:     String,
      enum:     { values: ['video', 'article', 'code'], message: '{VALUE} is not a valid lesson type' },
      required: [true, 'Lesson type is required'],
    },

    // ─── Content (only one should be filled based on type) ────────────────────
    videoUrl: { type: String, default: '' },
    article:  { type: String, default: '' },
    articleSections: [articleSectionSchema], // Structured article content
    code:     { type: String, default: '' },

    // ─── Meta ─────────────────────────────────────────────────────────────────
    duration: { type: Number, default: 0, min: 0 }, // minutes
    order: {
      type:     Number,
      required: [true, 'Lesson order is required'],
      min:      [1, 'Order must be at least 1'],
    },
    isFree: { type: Boolean, default: false }, // preview lesson (free even in premium path)
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
lessonSchema.index({ moduleId: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
