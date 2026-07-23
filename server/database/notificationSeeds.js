const NotificationTemplate = require('../models/NotificationTemplate');

/**
 * Notification template seeds for common system events.
 * Templates use handlebars-style placeholders: {{variable}}
 */
const notificationTemplates = [
  // ─── Learning Templates ─────────────────────────────────────────────────────
  {
    name: 'learning_path_enrolled',
    description: 'Sent when a user enrolls in a new learning path',
    titleTemplate: 'Welcome to {{pathName}}!',
    messageTemplate: 'You have successfully enrolled in {{pathName}}. Start learning today!',
    category: 'Learning',
    type: 'Success',
    priority: 'Medium',
    icon: 'book',
    variables: [
      { name: 'pathName', description: 'Name of the learning path', required: true },
    ],
    isActive: true,
  },
  {
    name: 'lesson_completed',
    description: 'Sent when a user completes a lesson',
    titleTemplate: 'Lesson Completed!',
    messageTemplate: 'Congratulations! You completed {{lessonName}} in {{moduleName}}.',
    category: 'Learning',
    type: 'Success',
    priority: 'Low',
    icon: 'check-circle',
    variables: [
      { name: 'lessonName', description: 'Name of the lesson', required: true },
      { name: 'moduleName', description: 'Name of the module', required: true },
    ],
    isActive: true,
  },
  
  // ─── Community Templates ────────────────────────────────────────────────────
  {
    name: 'community_joined',
    description: 'Sent when a user joins a community',
    titleTemplate: 'Welcome to {{communityName}}',
    messageTemplate: 'You are now a member of {{communityName}}. Start connecting with other members!',
    category: 'Community',
    type: 'Success',
    priority: 'Medium',
    icon: 'users',
    variables: [
      { name: 'communityName', description: 'Name of the community', required: true },
    ],
    isActive: true,
  },
  {
    name: 'post_comment',
    description: 'Sent when someone comments on a user\'s post',
    titleTemplate: 'New comment on your post',
    messageTemplate: '{{userName}} commented on your post: "{{postTitle}}"',
    category: 'Community',
    type: 'Information',
    priority: 'Low',
    icon: 'message',
    variables: [
      { name: 'userName', description: 'Name of the commenter', required: true },
      { name: 'postTitle', description: 'Title of the post', required: true },
    ],
    isActive: true,
  },
  
  // ─── Event Templates ────────────────────────────────────────────────────────
  {
    name: 'event_registered',
    description: 'Sent when a user registers for an event',
    titleTemplate: 'Event Registration Confirmed',
    messageTemplate: 'You are registered for {{eventName}} on {{eventDate}}. See you there!',
    category: 'Event',
    type: 'Success',
    priority: 'High',
    icon: 'calendar',
    variables: [
      { name: 'eventName', description: 'Name of the event', required: true },
      { name: 'eventDate', description: 'Event date', required: true },
    ],
    isActive: true,
  },
  {
    name: 'event_reminder',
    description: 'Sent as an event reminder',
    titleTemplate: 'Reminder: {{eventName}} starts soon',
    messageTemplate: '{{eventName}} starts in {{timeRemaining}}. Don\'t miss it!',
    category: 'Event',
    type: 'Reminder',
    priority: 'High',
    icon: 'bell',
    variables: [
      { name: 'eventName', description: 'Name of the event', required: true },
      { name: 'timeRemaining', description: 'Time until event starts', required: true },
    ],
    isActive: true,
  },
  
  // ─── Assessment Templates ───────────────────────────────────────────────────
  {
    name: 'test_completed',
    description: 'Sent when a user completes a test',
    titleTemplate: 'Test Submitted Successfully',
    messageTemplate: 'You scored {{score}}% on {{testName}}. Great job!',
    category: 'Assessment',
    type: 'Success',
    priority: 'Medium',
    icon: 'award',
    variables: [
      { name: 'testName', description: 'Name of the test', required: true },
      { name: 'score', description: 'Test score', required: true },
    ],
    isActive: true,
  },
  
  // ─── Subscription Templates ─────────────────────────────────────────────────
  {
    name: 'plan_upgraded',
    description: 'Sent when a user upgrades their subscription',
    titleTemplate: 'Welcome to {{planName}}!',
    messageTemplate: 'Your subscription has been upgraded to {{planName}}. Enjoy your new features!',
    category: 'Subscription',
    type: 'Success',
    priority: 'High',
    icon: 'star',
    variables: [
      { name: 'planName', description: 'Name of the subscription plan', required: true },
    ],
    isActive: true,
  },
  {
    name: 'subscription_expiring',
    description: 'Sent when a subscription is about to expire',
    titleTemplate: 'Subscription Expiring Soon',
    messageTemplate: 'Your {{planName}} subscription expires in {{daysRemaining}} days. Renew now to keep access.',
    category: 'Subscription',
    type: 'Warning',
    priority: 'High',
    icon: 'alert-triangle',
    variables: [
      { name: 'planName', description: 'Name of the subscription plan', required: true },
      { name: 'daysRemaining', description: 'Days until expiration', required: true },
    ],
    isActive: true,
  },
  
  // ─── Instructor Templates ───────────────────────────────────────────────────
  {
    name: 'instructor_approved',
    description: 'Sent when an instructor application is approved',
    titleTemplate: 'Instructor Application Approved',
    messageTemplate: 'Congratulations! Your instructor application has been approved. You can now create courses.',
    category: 'Instructor',
    type: 'Success',
    priority: 'Critical',
    icon: 'shield-check',
    variables: [],
    isActive: true,
  },
  
  // ─── Sandbox Templates ──────────────────────────────────────────────────────
  {
    name: 'sandbox_completed',
    description: 'Sent when a user completes a sandbox project',
    titleTemplate: 'Sandbox Project Completed!',
    messageTemplate: 'You completed {{projectName}}. Your submission has been recorded.',
    category: 'Sandbox',
    type: 'Success',
    priority: 'Medium',
    icon: 'code',
    variables: [
      { name: 'projectName', description: 'Name of the sandbox project', required: true },
    ],
    isActive: true,
  },
  
  // ─── Codex Templates ────────────────────────────────────────────────────────
  {
    name: 'task_assigned',
    description: 'Sent when a task is assigned to a user',
    titleTemplate: 'New Task Assigned',
    messageTemplate: 'You have been assigned to: {{taskTitle}} in {{workspaceName}}',
    category: 'Codex',
    type: 'Information',
    priority: 'High',
    icon: 'clipboard',
    variables: [
      { name: 'taskTitle', description: 'Title of the task', required: true },
      { name: 'workspaceName', description: 'Name of the workspace', required: true },
    ],
    isActive: true,
  },
  
  // ─── System Templates ───────────────────────────────────────────────────────
  {
    name: 'maintenance_notice',
    description: 'Sent for scheduled maintenance',
    titleTemplate: 'Scheduled Maintenance',
    messageTemplate: 'CodeSphere will be under maintenance on {{date}} from {{startTime}} to {{endTime}}.',
    category: 'System',
    type: 'Warning',
    priority: 'High',
    icon: 'tool',
    variables: [
      { name: 'date', description: 'Maintenance date', required: true },
      { name: 'startTime', description: 'Start time', required: true },
      { name: 'endTime', description: 'End time', required: true },
    ],
    isActive: true,
  },
];

/**
 * Seed notification templates into the database.
 */
const seedNotificationTemplates = async () => {
  try {
    console.log('🌱 Seeding notification templates...');

    for (const template of notificationTemplates) {
      await NotificationTemplate.findOneAndUpdate(
        { name: template.name },
        template,
        { upsert: true, new: true }
      );
    }

    console.log('✅ Notification templates seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding notification templates:', error.message);
    throw error;
  }
};

module.exports = { seedNotificationTemplates };
