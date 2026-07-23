const mongoose = require('mongoose');

const workspaceAnalyticsSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      unique: true,
      index: true,
    },
    linesOfCode: {
      type: Number,
      default: 0,
    },
    totalCommits: {
      type: Number,
      default: 0,
    },
    codingHours: {
      type: Number,
      default: 0,
    },
    dailyActivity: [
      {
        date: { type: String }, // 'YYYY-MM-DD'
        commits: { type: Number, default: 0 },
        linesAdded: { type: Number, default: 0 },
        hoursLogged: { type: Number, default: 0 },
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkspaceAnalytics', workspaceAnalyticsSchema, 'workspaceAnalytics');
