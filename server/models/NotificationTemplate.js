const mongoose = require('mongoose');

const notificationTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    titleTemplate: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      // Supports handlebars-style placeholders: {{variable}}
    },
    messageTemplate: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
      // Supports handlebars-style placeholders: {{variable}}
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Learning',
        'Resources',
        'Community',
        'Live Session',
        'Event',
        'Codex',
        'Sandbox',
        'Assessment',
        'Subscription',
        'Instructor',
        'Admin',
        'System',
      ],
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Information', 'Success', 'Warning', 'Error', 'Reminder', 'Announcement'],
      default: 'Information',
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    icon: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    variables: [
      {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        required: { type: Boolean, default: false },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

notificationTemplateSchema.index({ name: 1, category: 1 });

// Method to render title from variables
notificationTemplateSchema.methods.renderTitle = function (variables = {}) {
  let title = this.titleTemplate;
  Object.entries(variables).forEach(([key, value]) => {
    title = title.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
  });
  return title;
};

// Method to render message from variables
notificationTemplateSchema.methods.renderMessage = function (variables = {}) {
  let message = this.messageTemplate;
  Object.entries(variables).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
  });
  return message;
};

const NotificationTemplate = mongoose.model('NotificationTemplate', notificationTemplateSchema);

module.exports = NotificationTemplate;
