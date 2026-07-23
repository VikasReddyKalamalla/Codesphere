const mongoose = require('mongoose');

const sessionRecordingSchema = new mongoose.Schema(
  {
    sessionId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'LiveSession',
      required: true,
    },
    uploadedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    title:        { type: String, default: '', trim: true },
    recordingUrl: { type: String, required: [true, 'Recording URL is required'] },
    duration:     { type: Number, default: 0 },  // minutes
    fileSizeMB:   { type: Number, default: 0 },
    isPublic:     { type: Boolean, default: false },
    views:        { type: Number, default: 0 },
    uploadedAt:   { type: Date, default: Date.now },
  },
  { timestamps: true }
);

sessionRecordingSchema.index({ sessionId: 1 });

module.exports = mongoose.model('SessionRecording', sessionRecordingSchema);
