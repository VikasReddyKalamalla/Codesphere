const mongoose = require('mongoose');

const sessionResourceSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiveSession',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Resource URL is required'],
      trim: true,
    },
    resourceType: {
      type: String,
      enum: ['pdf', 'notes', 'slide', 'github', 'link'],
      default: 'pdf',
    },
    fileSizeMB: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

sessionResourceSchema.index({ sessionId: 1, createdAt: -1 });

module.exports = mongoose.model('SessionResource', sessionResourceSchema);
