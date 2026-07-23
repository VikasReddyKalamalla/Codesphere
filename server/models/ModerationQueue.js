const mongoose = require('mongoose');

const moderationQueueSchema = new mongoose.Schema(
  {
    // Source report that triggered this moderation item
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
    },
    // Content being moderated
    contentType: {
      type: String,
      required: true,
      enum: ['Post', 'Comment', 'Community', 'Resource', 'Event', 'User'],
      index: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    // User who reported / flagged
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // The user who owns the content
    contentOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reason: {
      type: String,
      required: true,
      enum: ['spam', 'abuse', 'harassment', 'fake_information', 'inappropriate_content', 'phishing', 'other'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'deleted'],
      default: 'pending',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

moderationQueueSchema.index({ status: 1, createdAt: -1 });
moderationQueueSchema.index({ contentType: 1, contentId: 1 });

const ModerationQueue = mongoose.model('ModerationQueue', moderationQueueSchema);

module.exports = ModerationQueue;
