const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    // Who performed the action (admin, instructor, or user)
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    actorRole: {
      type: String,
      enum: ['admin', 'instructor', 'student'],
      required: true,
    },
    // What was done
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    // Which module the action belongs to
    module: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    // HTTP method
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
    // Endpoint that was called
    endpoint: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    // HTTP response status
    statusCode: {
      type: Number,
    },
    // Optional resource identifiers
    affectedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    affectedResourceType: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    affectedResourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    // Minimal before/after snapshot (for mutation events)
    changes: {
      type: mongoose.Schema.Types.Mixed,
    },
    // Network info
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

auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ module: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ affectedUser: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
