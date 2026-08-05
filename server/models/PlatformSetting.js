const mongoose = require('mongoose');

const platformSettingSchema = new mongoose.Schema(
  {
    // Singleton document – only one record will exist
    platformName: {
      type: String,
      default: 'CodeSphere',
      trim: true,
      maxlength: 100,
    },
    platformDescription: {
      type: String,
      default: 'Learn. Build. Collaborate.',
      trim: true,
      maxlength: 500,
    },
    registrationEnabled: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceMessage: {
      type: String,
      default: 'We are currently under maintenance. Please check back later.',
      trim: true,
      maxlength: 500,
    },
    maxUploadSize: {
      type: Number,
      default: 10485760, // 10 MB in bytes
      min: 0,
    },
    defaultTheme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light',
    },
    defaultLanguage: {
      type: String,
      default: 'en',
      trim: true,
      maxlength: 10,
    },
    announcementBanner: {
      enabled: { type: Boolean, default: false },
      message: { type: String, default: '', maxlength: 300 },
      link: { type: String, default: '', maxlength: 500 },
      bgColor: { type: String, default: '#3b82f6', maxlength: 20 },
      textColor: { type: String, default: '#ffffff', maxlength: 20 },
    },
    featuresEnabled: {
      learning: { type: Boolean, default: true },
      resources: { type: Boolean, default: true },
      community: { type: Boolean, default: true },
      events: { type: Boolean, default: true },
      liveSessions: { type: Boolean, default: true },
      codex: { type: Boolean, default: true },
      sandbox: { type: Boolean, default: true },
      tests: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true },
      instructor: { type: Boolean, default: true },
    },
    contactEmail: {
      type: String,
      default: 'support@codesphere.com',
      trim: true,
      maxlength: 100,
    },
    socialLinks: {
      twitter: { type: String, default: '', maxlength: 200 },
      linkedin: { type: String, default: '', maxlength: 200 },
      github: { type: String, default: '', maxlength: 200 },
      discord: { type: String, default: '', maxlength: 200 },
    },
    security: {
      rateLimitRequestsPerMin: { type: Number, default: 100 },
      maxFailedLogins: { type: Number, default: 5 },
      require2FA: { type: Boolean, default: false },
      corsAllowedOrigins: { type: String, default: '*' },
    },
    infrastructure: {
      webSocketPort: { type: Number, default: 5000 },
      compileMemoryLimitMB: { type: Number, default: 512 },
      cacheTtlSeconds: { type: Number, default: 3600 },
      autoBackupEnabled: { type: Boolean, default: true },
    },
    smtp: {
      smtpHost: { type: String, default: 'smtp.codesphere.com' },
      smtpPort: { type: Number, default: 587 },
      smtpSecure: { type: Boolean, default: true },
      smtpUser: { type: String, default: 'notifications@codesphere.com' },
      smtpSender: { type: String, default: 'CodeSphere System <noreply@codesphere.com>' },
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const PlatformSetting = mongoose.model('PlatformSetting', platformSettingSchema);

module.exports = PlatformSetting;
