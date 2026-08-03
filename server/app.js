const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { apiLimiter, authLimiter } = require('./middlewares/rateLimit.middleware');
const { performanceMonitoring } = require('./config/monitoring');

const authRoutes         = require('./routes/auth.routes');
const dashboardRoutes    = require('./routes/dashboard.routes');
const learningRoutes     = require('./routes/learning.routes');
const moduleRoutes       = require('./routes/module.routes');
const lessonRoutes       = require('./routes/lesson.routes');
const resourceRoutes     = require('./routes/resource.routes');
const categoryRoutes     = require('./routes/category.routes');
const bookmarkRoutes     = require('./routes/bookmark.routes');
const downloadRoutes     = require('./routes/download.routes');
const communityRoutes    = require('./routes/community.routes');
const postRoutes         = require('./routes/post.routes');
const commentRoutes      = require('./routes/comment.routes');
const taskCommentRoutes  = require('./routes/taskComment.routes');
const inviteRoutes       = require('./routes/invite.routes');
const reportRoutes       = require('./routes/report.routes');
const sessionRoutes      = require('./routes/session.routes');
const reminderRoutes     = require('./routes/reminder.routes');
const recordingRoutes    = require('./routes/recording.routes');
const eventRoutes         = require('./routes/event.routes');
const eventCategoryRoutes = require('./routes/eventCategory.routes');
const eventReminderRoutes = require('./routes/eventReminder.routes');
const workspaceRoutes     = require('./routes/workspace.routes');
const taskRoutes          = require('./routes/task.routes');
const taskAttachmentRoutes = require('./routes/taskAttachment.routes');
const milestoneRoutes     = require('./routes/milestone.routes');
const codexRoutes         = require('./routes/codex.routes');
const sandboxRoutes          = require('./routes/sandbox.routes');
const sandboxStepRoutes      = require('./routes/sandboxStep.routes');
const sandboxTemplateRoutes  = require('./routes/sandboxTemplate.routes');
const sandboxSubmissionRoutes = require('./routes/sandboxSubmission.routes');
const testRoutes             = require('./routes/test.routes');
const questionRoutes         = require('./routes/question.routes');
const questionCategoryRoutes = require('./routes/questionCategory.routes');
const testAttemptRoutes      = require('./routes/testAttempt.routes');
const profileRoutes      = require('./routes/profile.routes');
const instructorRoutes   = require('./routes/instructor.routes');
const adminRoutes        = require('./routes/admin.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const planRoutes         = require('./routes/plan.routes');
const billingRoutes      = require('./routes/billing.routes');
const invoiceRoutes      = require('./routes/invoice.routes');
const paymentRoutes      = require('./routes/payment.routes');
const featureRoutes      = require('./routes/feature.routes');
const notificationRoutes = require('./routes/notification.routes');
const templateRoutes     = require('./routes/template.routes');
const preferenceRoutes   = require('./routes/preference.routes');
const announcementRoutes = require('./routes/announcement.routes');
const logRoutes          = require('./routes/log.routes');
const applicationRoutes  = require('./routes/application.routes');
const instructorCourseRoutes   = require('./routes/instructorCourse.routes');
const instructorStudentRoutes  = require('./routes/instructorStudent.routes');
const instructorAnalyticsRoutes = require('./routes/instructorAnalytics.routes');
const instructorCertificateRoutes = require('./routes/instructorCertificate.routes');

const cloudWorkspaceRoutes = require('./routes/cloudWorkspace.routes');
const cloudWorkspaceProxyHandler = require('./middlewares/cloudWorkspaceProxy.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// ─── Reverse Proxy for Cloud Workspace containers ──────────────────
app.use('/workspace-proxy', cloudWorkspaceProxyHandler);

// ─── Global Middlewares ───────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');

// Security headers (allow VS Code iframe to load from same origin)
app.use(helmet({
  contentSecurityPolicy: false,   // VS Code Web sets its own CSP
  frameguard: false,              // we control X-Frame-Options per-route
}));

// Compression
app.use(compression());

// Performance monitoring
app.use(performanceMonitoring);

// Rate limiting
app.use('/api/', apiLimiter);

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Uploads ──────────────────────────────────────────────────────────
app.use('/uploads', express.static('uploads'));
app.use('/preview', express.static(require('path').join(__dirname, 'uploads/workspaces')));

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/dashboard',     dashboardRoutes);
app.use('/api/learning',      learningRoutes);
app.use('/api/modules',       moduleRoutes);
app.use('/api/lessons',       lessonRoutes);
app.use('/api/resources',     resourceRoutes);
app.use('/api/categories',    categoryRoutes);
app.use('/api/bookmarks',     bookmarkRoutes);
app.use('/api/downloads',     downloadRoutes);
app.use('/api/community',     communityRoutes);
app.use('/api/posts',         postRoutes);
app.use('/api/post-comments', commentRoutes);
app.use('/api/invites',       inviteRoutes);
app.use('/api/reports',       reportRoutes);
app.use('/api/sessions',      sessionRoutes);
app.use('/api/reminders',     reminderRoutes);
app.use('/api/recordings',    recordingRoutes);
app.use('/api/events',           eventRoutes);
app.use('/api/event-categories', eventCategoryRoutes);
app.use('/api/event-reminders',  eventReminderRoutes);
app.use('/api/workspaces',       workspaceRoutes);
app.use('/api/tasks',            taskRoutes);
app.use('/api/task-comments',    taskCommentRoutes);
app.use('/api/attachments',      taskAttachmentRoutes);
app.use('/api/milestones',       milestoneRoutes);
app.use('/api/codex/projects',   codexRoutes);
app.use('/api/codex',            workspaceRoutes);
app.use('/api/sandbox',            sandboxRoutes);
app.use('/api/steps',              sandboxStepRoutes);
app.use('/api/templates',          sandboxTemplateRoutes);
app.use('/api/submissions',        sandboxSubmissionRoutes);
app.use('/api/tests',            testRoutes);
app.use('/api/questions',        questionRoutes);
app.use('/api/question-categories', questionCategoryRoutes);
app.use('/api/attempts',         testAttemptRoutes);
app.use('/api/profile',          profileRoutes);
app.use('/api/instructor',    instructorRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/instructor-applications',   applicationRoutes);
app.use('/api/instructor-courses',        instructorCourseRoutes);
app.use('/api/instructor-students',       instructorStudentRoutes);
app.use('/api/instructor-analytics',      instructorAnalyticsRoutes);
app.use('/api/instructor-certificates',   instructorCertificateRoutes);
const couponRoutes       = require('./routes/coupon.routes');
const referralRoutes     = require('./routes/referral.routes');
const usageRoutes        = require('./routes/usage.routes');
const organizationRoutes = require('./routes/organization.routes');
const codeExecutionRoutes = require('./routes/codeExecution.routes');
const liveStreamRoutes = require('./routes/liveStream.routes');
const analyticsAdvancedRoutes = require('./routes/analyticsAdvanced.routes');
const backupRoutes = require('./routes/backup.routes');
const webIDERoutes = require('./routes/webIDE.routes');

const settingsRoutes = require('./routes/settings.routes');

app.use('/api/coupons',       couponRoutes);
app.use('/api/referrals',     referralRoutes);
app.use('/api/usage',         usageRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/execute',       codeExecutionRoutes);
app.use('/api/streaming',     liveStreamRoutes);
app.use('/api/analytics',     analyticsAdvancedRoutes);
app.use('/api/backups',       backupRoutes);
app.use('/api/cloud-workspace', cloudWorkspaceRoutes);
app.use('/api/ide',           webIDERoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/plans',         planRoutes);
app.use('/api/billing',       billingRoutes);
app.use('/api/invoices',      invoiceRoutes);
app.use('/api/payments',      paymentRoutes);
app.use('/api/features',                featureRoutes);
app.use('/api/notifications',           notificationRoutes);
app.use('/api/notification-templates',  templateRoutes);
app.use('/api/notification-preferences',preferenceRoutes);
app.use('/api/announcements',           announcementRoutes);
app.use('/api/notification-logs',       logRoutes);
app.use('/api/settings',                settingsRoutes);

// ─── API Documentation ────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api/swagger-spec',
  },
}));

app.get('/api/swagger-spec', (req, res) => {
  res.json(swaggerSpec);
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'CodeSphere API is running' });
});

app.get('/health', async (req, res) => {
  const { getHealthStatus } = require('./config/monitoring');
  const mongoose = require('mongoose');
  const health = await getHealthStatus(mongoose);
  res.status(health.status === 'healthy' ? 200 : 503).json(health);
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
