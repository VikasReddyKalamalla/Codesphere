const mongoose = require('mongoose');

const sandboxTemplateSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    projectId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'SandboxProject',
      required: [true, 'Project ID is required'],
    },
    uploadedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Uploader is required'],
    },

    // ─── Template Info ────────────────────────────────────────────────────────
    templateType: {
      type:    String,
      enum:    { values: ['starter', 'completed', 'assets', 'documentation'], message: '{VALUE} is not a valid template type' },
      default: 'starter',
    },
    title: {
      type:      String,
      required:  [true, 'Template title is required'],
      trim:      true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // ─── File Info ────────────────────────────────────────────────────────────
    fileUrl: {
      type:     String,
      required: [true, 'File URL is required'],
    },
    fileSize: { type: Number, default: 0 }, // in bytes

    // ─── Stats ────────────────────────────────────────────────────────────────
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
sandboxTemplateSchema.index({ projectId: 1, templateType: 1 });
sandboxTemplateSchema.index({ projectId: 1 });

module.exports = mongoose.model('SandboxTemplate', sandboxTemplateSchema);
