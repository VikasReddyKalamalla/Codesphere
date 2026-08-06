const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema(
  {
    // ─── Core Info ───────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Title is required'],
      trim:      true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type:     String,
      required: [true, 'Category is required'],
      trim:     true,
    },
    difficulty: {
      type:    String,
      enum:    { values: ['beginner', 'intermediate', 'advanced'], message: '{VALUE} is not a valid difficulty' },
      default: 'beginner',
    },
    thumbnail: { type: String, default: '' },

    // ─── Stats (auto-calculated) ──────────────────────────────────────────────
    duration:      { type: Number, default: 0 },   // total minutes (sum of lessons)
    rating:        { type: Number, default: 0, min: 0, max: 5 },
    totalStudents: { type: Number, default: 0 },

    // ─── Relationships ────────────────────────────────────────────────────────
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    createdBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Creator is required'],
    },

    // ─── Access & Verification Workflow ────────────────────────────────────
    isPremium:   { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ['Draft', 'Pending_Approval', 'Approved', 'Rejected'],
      default: 'Approved',
      index: true,
    },
    submittedForApprovalAt: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectionReason: { type: String, trim: true },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
learningPathSchema.index({ category: 1 });
learningPathSchema.index({ difficulty: 1 });
learningPathSchema.index({ createdBy: 1 });
learningPathSchema.index({ title: 'text', description: 'text' }); // text search

module.exports = mongoose.model('LearningPath', learningPathSchema);
