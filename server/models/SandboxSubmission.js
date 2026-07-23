const mongoose = require('mongoose');

const sandboxSubmissionSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────────────
    projectId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'SandboxProject',
      required: [true, 'Project ID is required'],
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User ID is required'],
    },

    // ─── Submission Content ───────────────────────────────────────────────────
    submissionType: {
      type:    String,
      enum:    { values: ['github', 'zip', 'live_demo'], message: '{VALUE} is not a valid submission type' },
      default: 'github',
    },
    githubUrl:   { type: String, default: '' },
    zipFileUrl:  { type: String, default: '' },
    liveDemoUrl: { type: String, default: '' },
    notes:       { type: String, default: '', maxlength: [2000, 'Notes cannot exceed 2000 characters'] },

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    { values: ['pending', 'reviewed', 'approved', 'rejected'], message: '{VALUE} is not a valid status' },
      default: 'pending',
    },

    // ─── Review ───────────────────────────────────────────────────────────────
    reviewedBy: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'User',
      default: null,
    },
    reviewNotes: { type: String, default: '' },
    reviewedAt:  { type: Date, default: null },

    // ─── Timestamps ───────────────────────────────────────────────────────────
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
sandboxSubmissionSchema.index({ projectId: 1, userId: 1 });
sandboxSubmissionSchema.index({ userId: 1, status: 1 });
sandboxSubmissionSchema.index({ projectId: 1, status: 1 });

module.exports = mongoose.model('SandboxSubmission', sandboxSubmissionSchema);
