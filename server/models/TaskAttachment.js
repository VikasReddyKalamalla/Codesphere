const mongoose = require('mongoose');

const taskAttachmentSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    taskId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Task',
      required: [true, 'Task ID is required'],
    },
    uploadedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Uploader is required'],
    },

    // ─── File Info ────────────────────────────────────────────────────────────
    fileName: {
      type:      String,
      required:  [true, 'File name is required'],
      maxlength: [255, 'File name cannot exceed 255 characters'],
    },
    fileUrl: {
      type:     String,
      required: [true, 'File URL is required'],
    },
    fileType: { type: String, default: '' },
    fileSize: { type: Number, default: 0 }, // in bytes

    // ─── Timestamps ───────────────────────────────────────────────────────────
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
taskAttachmentSchema.index({ taskId: 1, uploadedAt: -1 });
taskAttachmentSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('TaskAttachment', taskAttachmentSchema);
