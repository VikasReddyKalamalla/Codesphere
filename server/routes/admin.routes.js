const express = require('express');
const router  = express.Router();

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// Controllers
const adminCtrl        = require('../controllers/admin.controller');
const userCtrl         = require('../controllers/adminUserManagement.controller');
const contentCtrl      = require('../controllers/adminContent.controller');
const reportCtrl       = require('../controllers/adminReport.controller');
const moderationCtrl   = require('../controllers/adminModeration.controller');
const analyticsCtrl    = require('../controllers/adminAnalytics.controller');
const settingCtrl      = require('../controllers/adminSetting.controller');
const featureCtrl      = require('../controllers/adminFeatureToggle.controller');
const healthCtrl       = require('../controllers/adminHealth.controller');
const auditCtrl        = require('../controllers/adminAudit.controller');
const announcementCtrl = require('../controllers/adminAnnouncement.controller');
const instructorCtrl   = require('../controllers/adminInstructor.controller');

// All admin routes require authentication + admin role
router.use(protect, restrictTo('admin'));

// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get('/dashboard',   adminCtrl.getDashboard);
router.get('/statistics',  adminCtrl.getStatistics);

// ─── User Management ─────────────────────────────────────────────────────────
router.get   ('/users',              userCtrl.getAllUsers);
router.get   ('/users/:id',          userCtrl.getUserById);
router.put   ('/users/:id',          userCtrl.updateUser);
router.delete('/users/:id',          userCtrl.deleteUser);
router.put   ('/users/:id/suspend',  userCtrl.suspendUser);
router.put   ('/users/:id/activate', userCtrl.activateUser);
router.put   ('/users/:id/role',     userCtrl.updateUserRole);
router.post  ('/users/:id/reset-password', userCtrl.resetPassword);
router.post  ('/users/:id/notify',         userCtrl.sendNotification);
router.post  ('/users/:id/email',          userCtrl.sendEmail);

// ─── Instructor Management ────────────────────────────────────────────────────
router.get('/instructors',                      instructorCtrl.getAllInstructors);
router.put('/instructors/:id/approve',          instructorCtrl.approveApplication);
router.put('/instructors/:id/reject',           instructorCtrl.rejectApplication);
router.put('/instructors/:id/suspend',          instructorCtrl.suspendInstructor);
router.delete('/instructors/:id',               instructorCtrl.removeInstructor);

// ─── Content Management ───────────────────────────────────────────────────────
router.get   ('/content/learning-paths',         contentCtrl.getLearningPaths);
router.post  ('/content/learning-paths',         contentCtrl.createLearningPath);
router.put   ('/content/learning-paths/:id',     contentCtrl.updateLearningPath);
router.delete('/content/learning-paths/:id',     contentCtrl.deleteLearningPath);
router.post  ('/content/learning-paths/:id/duplicate', contentCtrl.duplicateLearningPath);
router.post  ('/content/learning-paths/:id/publish',   contentCtrl.publishLearningPath);
router.post  ('/content/learning-paths/:id/archive',   contentCtrl.archiveLearningPath);
router.get   ('/content/learning-paths/:id/structure', contentCtrl.getLearningPathStructure);
router.get   ('/content/learning-paths/:id/analytics', contentCtrl.getLearningPathAnalytics);

router.post  ('/content/modules/reorder',         contentCtrl.reorderModules);
router.post  ('/content/lessons/reorder',         contentCtrl.reorderLessons);
router.get   ('/content/resources',              contentCtrl.getResources);
router.delete('/content/resources/:id',          contentCtrl.deleteResource);
router.get   ('/content/communities',            contentCtrl.getCommunities);
router.put   ('/content/communities/:id',        contentCtrl.updateCommunity);
router.delete('/content/communities/:id',        contentCtrl.deleteCommunity);
router.get   ('/content/events',                 contentCtrl.getEvents);
router.put   ('/content/events/:id',             contentCtrl.updateEvent);
router.delete('/content/events/:id',             contentCtrl.deleteEvent);
router.get   ('/content/sandbox-projects',       contentCtrl.getSandboxProjects);
router.get   ('/content/workspaces',             contentCtrl.getWorkspaces);
router.get   ('/content/assessments',            contentCtrl.getAssessments);
router.get   ('/content/live-sessions',          contentCtrl.getLiveSessions);

// ─── Moderation ───────────────────────────────────────────────────────────────
router.get   ('/moderation',            moderationCtrl.getModerationQueue);
router.put   ('/moderation/:id/approve',moderationCtrl.approveContent);
router.put   ('/moderation/:id/reject', moderationCtrl.rejectContent);
router.delete('/moderation/:id',        moderationCtrl.deleteModerationItem);

// ─── Reports ─────────────────────────────────────────────────────────────────
router.get   ('/reports',     reportCtrl.getReports);
router.post  ('/reports',     reportCtrl.createReport);
router.get   ('/reports/:id', reportCtrl.getReportById);
router.put   ('/reports/:id', reportCtrl.updateReport);
router.delete('/reports/:id', reportCtrl.deleteReport);

// ─── Platform Settings ────────────────────────────────────────────────────────
router.get('/settings', settingCtrl.getSettings);
router.put('/settings', settingCtrl.updateSettings);

// ─── Feature Toggles ─────────────────────────────────────────────────────────
router.get('/features',     featureCtrl.getFeatureToggles);
router.put('/features/:id', featureCtrl.updateFeatureToggle);

// ─── Platform Analytics ───────────────────────────────────────────────────────
router.get ('/analytics/realtime', analyticsCtrl.getRealtimeAnalytics);
router.get ('/analytics/events',   analyticsCtrl.getAnalyticsEvents);
router.post('/analytics/generate', analyticsCtrl.generateAnalytics);
router.post('/analytics/simulate', analyticsCtrl.simulateTrafficEvent);
router.post('/analytics/seed',     analyticsCtrl.seedAnalyticsData);
router.get ('/analytics',          analyticsCtrl.getAnalytics);

// ─── System Health ────────────────────────────────────────────────────────────
router.get('/system-health',         healthCtrl.getSystemHealth);
router.get('/system-health/history', healthCtrl.getHealthHistory);

// ─── Audit Logs ───────────────────────────────────────────────────────────────
router.get('/audit-logs', auditCtrl.getAuditLogs);

// ─── Announcements ────────────────────────────────────────────────────────────
router.get   ('/announcements',             announcementCtrl.getAnnouncements);
router.post  ('/announcements',             announcementCtrl.createAnnouncement);
router.put   ('/announcements/:id',         announcementCtrl.updateAnnouncement);
router.post  ('/announcements/:id/broadcast', announcementCtrl.broadcastAnnouncement);
router.delete('/announcements/:id',         announcementCtrl.deleteAnnouncement);

module.exports = router;
