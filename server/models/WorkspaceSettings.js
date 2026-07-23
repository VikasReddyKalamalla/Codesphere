const mongoose = require('mongoose');

const workspaceSettingsSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      unique: true,
      index: true,
    },
    theme: { type: String, default: 'dark' },
    editorMinimap: { type: Boolean, default: true },
    editorLineNumbers: { type: Boolean, default: true },
    editorWordWrap: { type: Boolean, default: true },
    enableAutosave: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkspaceSettings', workspaceSettingsSchema, 'workspaceSettings');
