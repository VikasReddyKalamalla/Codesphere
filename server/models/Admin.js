const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    department: {
      type: String,
      trim: true,
      maxlength: 100,
      default: 'General',
    },
    permissions: [
      {
        type: String,
        enum: [
          'manage_users',
          'manage_instructors',
          'manage_content',
          'manage_subscriptions',
          'manage_reports',
          'manage_moderation',
          'manage_settings',
          'manage_analytics',
          'manage_announcements',
          'super_admin',
        ],
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
      index: true,
    },
    lastLoginAt: {
      type: Date,
    },
    lastLoginIp: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
