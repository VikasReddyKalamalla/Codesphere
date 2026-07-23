const mongoose = require('mongoose');

const userApiKeySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    keyName: { type: String, required: true },
    keyPrefix: { type: String, required: true },
    keyHash: { type: String, required: true },
    scopes: [{ type: String, default: 'read:profile' }],
    expiresAt: { type: Date },
    lastUsedAt: { type: Date },
    isRevoked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserApiKey', userApiKeySchema);
