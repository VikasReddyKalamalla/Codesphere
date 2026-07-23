const mongoose = require('mongoose');

const userDeviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    deviceName: { type: String, default: 'Chrome on Windows 11' },
    os: { type: String, default: 'Windows 11' },
    browser: { type: String, default: 'Chrome 126.0' },
    ipAddress: { type: String, default: '127.0.0.1' },
    location: { type: String, default: 'Bengaluru, India' },
    lastActiveAt: { type: Date, default: Date.now },
    isCurrent: { type: Boolean, default: false },
    isTrusted: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserDevice', userDeviceSchema);
