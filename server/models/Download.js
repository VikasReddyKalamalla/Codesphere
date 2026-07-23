const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema(
  {
    resourceId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Resource',
      required: true,
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    downloadedAt: { type: Date, default: Date.now },
    ipAddress:    { type: String, default: '' },  // for analytics
  },
  { timestamps: false }
);

// Index for fast history lookups
downloadSchema.index({ resourceId: 1 });
downloadSchema.index({ userId: 1 });
downloadSchema.index({ downloadedAt: -1 });

module.exports = mongoose.model('Download', downloadSchema);
