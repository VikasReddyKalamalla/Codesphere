const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    // Unique key used as the Socket.IO room name: e.g. "community:abc123"
    roomKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['community', 'workspace', 'session', 'private', 'admin'],
      index: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    // Reference to the owning entity (community, workspace, session, etc.)
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    referenceModel: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    // Currently connected user IDs (in-memory mirror for quick queries)
    activeUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
