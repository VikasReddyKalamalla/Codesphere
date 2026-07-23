const express = require('express');
const router  = express.Router();

const {
  getAllEvents,
  getEventById,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  cancelEvent,
  rescheduleEvent,
  getMyEvents,
  getEventAnalytics,
  getGlobeEvents,
  getEventAnalyticsSummary,
  getAiRecommendations,
  toggleEventLike,
} = require('../controllers/event.controller');

const {
  registerForEvent,
  cancelRegistration,
  getEventRegistrations,
  getUserRegistrations,
  checkRegistrationStatus,
} = require('../controllers/eventRegistration.controller');

const {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
  isBookmarked,
} = require('../controllers/eventBookmark.controller');

const {
  createReminder,
  getReminders,
} = require('../controllers/eventReminder.controller');

const {
  issueCertificate,
  getEventCertificates,
  getMyCertificates,
} = require('../controllers/eventCertificate.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Special & Discovery Endpoints ───────────────────────────────────────────
router.get('/globe/markers',       getGlobeEvents);
router.get('/analytics/summary',   getEventAnalyticsSummary);
router.get('/ai/recommendations', getAiRecommendations);

// ─── Event CRUD ───────────────────────────────────────────────────────────────
router.get   ('/',           getAllEvents);
router.get   ('/slug/:slug', getEventBySlug);
router.get   ('/my/organized', protect, getMyEvents);
router.get   ('/:id',        getEventById);
router.post  ('/',           protect, restrictTo('instructor', 'admin'), createEvent);
router.put   ('/:id',        protect, updateEvent);
router.delete('/:id',        protect, deleteEvent);

// ─── Lifecycle & Engagement ───────────────────────────────────────────────────
router.patch('/:id/publish',    protect, publishEvent);
router.patch('/:id/cancel',     protect, cancelEvent);
router.patch('/:id/reschedule', protect, rescheduleEvent);
router.post ('/:id/like',       protect, toggleEventLike);

// ─── Analytics ────────────────────────────────────────────────────────────────
router.get('/:id/analytics', protect, getEventAnalytics);

// ─── Registration ─────────────────────────────────────────────────────────────
router.post  ('/:id/register',            protect, registerForEvent);
router.delete('/:id/register',            protect, cancelRegistration);
router.get   ('/:id/registrations',       protect, getEventRegistrations);
router.get   ('/my/registrations',        protect, getUserRegistrations);
router.get   ('/:id/registration-status', protect, checkRegistrationStatus);

// ─── Bookmarks ────────────────────────────────────────────────────────────────
router.post  ('/:id/bookmark',        protect, addBookmark);
router.delete('/:id/bookmark',        protect, removeBookmark);
router.get   ('/my/bookmarks',        protect, getUserBookmarks);
router.get   ('/:id/bookmark-status', protect, isBookmarked);

// ─── Reminders ────────────────────────────────────────────────────────────────
router.post('/:id/reminder',  protect, createReminder);
router.get ('/:id/reminders', protect, getReminders);

// ─── Certificates ─────────────────────────────────────────────────────────────
router.post('/:id/certificates', protect, restrictTo('instructor', 'admin'), issueCertificate);
router.get ('/:id/certificates', protect, getEventCertificates);
router.get ('/my/certificates',  protect, getMyCertificates);

module.exports = router;
