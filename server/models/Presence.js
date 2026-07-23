const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['online', 'away', 'busy', 'offline'],
      default: 'offline',
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    // Current context
    currentRoom: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    currentWorkspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
    },
    currentSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiveSession',
    },
    // All active socket IDs for this user (multi-tab support)
    socketIds: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

presenceSchema.index({ isOnline: 1, lastActiveAt: -1 });

const Presence = mongoose.model('Presence', presenceSchema);

module.exports = Presence;
