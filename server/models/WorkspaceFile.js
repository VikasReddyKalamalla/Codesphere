const mongoose = require('mongoose');

const workspaceFileSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['file', 'folder'],
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkspaceFile',
      default: null,
    },
  },
  { timestamps: true }
);

workspaceFileSchema.index({ workspaceId: 1, path: 1 }, { unique: true });

module.exports = mongoose.model('WorkspaceFile', workspaceFileSchema, 'workspaceFiles');
