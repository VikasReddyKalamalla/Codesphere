const mongoose = require('mongoose');

const sandboxDownloadSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    templateId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'SandboxTemplate',
      required: [true, 'Template ID is required'],
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User ID is required'],
    },

    // ─── Meta ─────────────────────────────────────────────────────────────────
    downloadedAt: { type: Date, default: Date.now },
    ipAddress:    { type: String, default: '' },
  },
  { timestamps: false }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
sandboxDownloadSchema.index({ templateId: 1 });
sandboxDownloadSchema.index({ userId: 1 });
sandboxDownloadSchema.index({ downloadedAt: -1 });

module.exports = mongoose.model('SandboxDownload', sandboxDownloadSchema);
