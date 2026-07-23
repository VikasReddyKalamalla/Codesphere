const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planType: {
      type: String,
      enum: ['team', 'enterprise', 'corporate', 'university'],
      default: 'team',
    },
    totalSeats: { type: Number, default: 5 },
    usedSeats: { type: Number, default: 1 },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        email: { type: String },
        role: { type: String, enum: ['admin', 'member', 'billing_admin'], default: 'member' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    billingEmail: { type: String },
    ssoEnabled: { type: Boolean, default: false },
    ssoProvider: { type: String, default: 'okta' },
    customDomain: { type: String, default: '' },
    dedicatedStorageGB: { type: Number, default: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', organizationSchema);
