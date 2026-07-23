const mongoose = require('mongoose');

const usageTrackerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    periodMonth: { type: String, required: true }, // Format YYYY-MM
    sandboxMinutesUsed: { type: Number, default: 0 },
    aiCreditsUsed: { type: Number, default: 0 },
    downloadsCount: { type: Number, default: 0 },
    storageUsedMB: { type: Number, default: 0 },
    projectsCreated: { type: Number, default: 0 },
    workspacesCreated: { type: Number, default: 0 },
    certificatesEarned: { type: Number, default: 0 },
    liveSessionsJoined: { type: Number, default: 0 },
    apiCallsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

usageTrackerSchema.index({ userId: 1, periodMonth: 1 }, { unique: true });

module.exports = mongoose.model('UsageTracker', usageTrackerSchema);
