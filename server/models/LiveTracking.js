const mongoose = require('mongoose');

const liveTrackingSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiveSession',
      required: true,
      unique: true,
      index: true,
    },
    // Currently connected participants
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        socketId: { type: String },
        joinedAt: { type: Date, default: Date.now },
        role: { type: String, enum: ['host', 'participant'], default: 'participant' },
      },
    ],
    participantCount: {
      type: Number,
      default: 0,
    },
    peakParticipantCount: {
      type: Number,
      default: 0,
    },
    isLive: {
      type: Boolean,
      default: false,
      index: true,
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const LiveTracking = mongoose.model('LiveTracking', liveTrackingSchema);

module.exports = LiveTracking;
