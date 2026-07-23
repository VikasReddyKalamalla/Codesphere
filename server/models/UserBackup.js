const mongoose = require('mongoose');

const userBackupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    backupName: { type: String, required: true },
    sizeMB: { type: Number, default: 4.2 },
    downloadUrl: { type: String, default: '#' },
    status: { type: String, enum: ['completed', 'processing', 'failed'], default: 'completed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserBackup', userBackupSchema);
