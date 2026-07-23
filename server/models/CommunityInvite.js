const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema(
  {
    communityId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Community',
      required: true,
    },
    invitedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    invitedUser: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    status: {
      type:    String,
      enum:    ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
    },
    message:    { type: String, default: '', maxlength: 300 },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Only one pending invite per user per community
inviteSchema.index({ communityId: 1, invitedUser: 1, status: 1 }, { unique: true });

module.exports = mongoose.model('CommunityInvite', inviteSchema);
