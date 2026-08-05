const mongoose = require('mongoose');

const userSandboxWorkspaceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
    },
    containerPath: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSandboxWorkspaceSchema.index({ userId: 1, projectId: 1 }, { unique: true });

module.exports = mongoose.model('UserSandboxWorkspace', userSandboxWorkspaceSchema);
