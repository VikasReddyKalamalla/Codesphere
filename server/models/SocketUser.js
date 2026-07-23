const mongoose = require('mongoose');

const socketUserSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    socketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Active rooms this socket has joined
    rooms: [{ type: String }],
    ipAddress: {
      type: String,
      trim: true,
      maxlength: 45,
    },
    userAgent: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

socketUserSchema.index({ user: 1, socketId: 1 });

const SocketUser = mongoose.model('SocketUser', socketUserSchema);

module.exports = SocketUser;
