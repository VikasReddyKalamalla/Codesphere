const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    targetType: {
      type:     String,
      enum:     ['post', 'comment', 'community'],
      required: true,
    },
    targetId: {
      type:     mongoose.Schema.Types.ObjectId,
      required: true,
      refPath:  'targetModel',
    },
    targetModel: {
      type:    String,
      enum:    ['Post', 'Comment', 'Community'],
      required: true,
    },
    reason: {
      type:     String,
      enum:     ['spam', 'abuse', 'harassment', 'fake_information', 'inappropriate_content', 'other'],
      required: true,
    },
    description: { type: String, default: '', maxlength: 500 },
    status: {
      type:    String,
      enum:    ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

reportSchema.index({ targetId: 1 });
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ status: 1 });

module.exports = mongoose.model('Report', reportSchema);
