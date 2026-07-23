const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      // E.g. "User Suspended", "Content Deleted", "Application Approved"
    },
    module: {
      type: String,
      required: true,
      enum: [
        'Users',
        'Instructors',
        'Content',
        'Subscriptions',
        'Reports',
        'Moderation',
        'Settings',
        'Analytics',
        'Announcements',
        'System',
      ],
      index: true,
    },
    affectedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    affectedResource: {
      type: mongoose.Schema.Types.ObjectId,
    },
    affectedResourceType: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
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
  },
  {
    timestamps: true,
  }
);

adminLogSchema.index({ admin: 1, createdAt: -1 });
adminLogSchema.index({ module: 1, createdAt: -1 });
adminLogSchema.index({ affectedUser: 1 });

const AdminLog = mongoose.model('AdminLog', adminLogSchema);

module.exports = AdminLog;
