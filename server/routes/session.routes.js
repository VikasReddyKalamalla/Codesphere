const express = require('express');
const router  = express.Router();

const {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  publishSession,
  cancelSession,
  goLive,
  endSession,
  getSessionAnalytics,
  duplicateSession,
  archiveSession,
} = require('../controllers/liveSession.controller');

const { registerForSession, cancelRegistration, getRegistrations, getUserRegistrations } = require('../controllers/registration.controller');
const { checkIn, checkOut, getAttendance }  = require('../controllers/attendance.controller');
const { submitFeedback, getFeedback }       = require('../controllers/feedback.controller');
const { createReminder, getReminders }      = require('../controllers/reminder.controller');
const { addRecording, getRecordings }       = require('../controllers/recording.controller');

const { getQuestions, askQuestion, postAnswer, voteQuestion, pinQuestion, markAnswered } = require('../controllers/sessionQuestion.controller');
const { getPolls, createPoll, votePoll, closePoll } = require('../controllers/sessionPoll.controller');
const { getQuizzes, createQuiz, startQuiz, submitQuizAttempt } = require('../controllers/sessionQuiz.controller');
const { getResources, uploadResource, deleteResource } = require('../controllers/sessionResource.controller');
const { getCertificates, generateCertificate } = require('../controllers/sessionCertificate.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Certificates General ─────────────────────────────────────────────────────
router.get('/my-certificates', protect, getCertificates);

// ─── Session CRUD ─────────────────────────────────────────────────────────────
router.get   ('/',    protect, getAllSessions);
router.get   ('/my-sessions', protect, getUserRegistrations);
router.get   ('/:id', protect, getSessionById);
router.post  ('/',    protect, restrictTo('instructor', 'admin'), createSession);
router.put   ('/:id', protect, updateSession);
router.delete('/:id', protect, deleteSession);

// ─── Lifecycle ────────────────────────────────────────────────────────────────
router.patch('/:id/publish',  protect, publishSession);
router.patch('/:id/cancel',   protect, cancelSession);
router.patch('/:id/go-live',  protect, goLive);
router.patch('/:id/end',      protect, endSession);
router.post ('/:id/duplicate',protect, restrictTo('instructor', 'admin'), duplicateSession);
router.patch('/:id/archive',  protect, restrictTo('instructor', 'admin'), archiveSession);

// ─── Analytics ────────────────────────────────────────────────────────────────
router.get('/:id/analytics', protect, getSessionAnalytics);

// ─── Registration ─────────────────────────────────────────────────────────────
router.post  ('/:id/register',      protect, registerForSession);
router.delete('/:id/register',      protect, cancelRegistration);
router.get   ('/:id/registrations', protect, getRegistrations);

// ─── Attendance ───────────────────────────────────────────────────────────────
router.post('/:id/check-in',  protect, checkIn);
router.post('/:id/check-out', protect, checkOut);
router.get ('/:id/attendance', protect, getAttendance);

// ─── Feedback ─────────────────────────────────────────────────────────────────
router.post('/:id/feedback', protect, submitFeedback);
router.get ('/:id/feedback', protect, getFeedback);

// ─── Reminders ────────────────────────────────────────────────────────────────
router.post('/:id/reminder',  protect, createReminder);
router.get ('/:id/reminders', protect, getReminders);

// ─── Recordings ───────────────────────────────────────────────────────────────
router.post('/:id/recording',  protect, restrictTo('instructor', 'admin'), addRecording);
router.get ('/:id/recordings', protect, getRecordings);

// ─── Questions Q&A ────────────────────────────────────────────────────────────
router.get  ('/:id/questions', protect, getQuestions);
router.post ('/:id/questions', protect, askQuestion);
router.post ('/:id/questions/:qId/answers', protect, postAnswer);
router.patch('/:id/questions/:qId/vote', protect, voteQuestion);
router.patch('/:id/questions/:qId/pin', protect, pinQuestion);
router.patch('/:id/questions/:qId/answered', protect, markAnswered);

// ─── Polls ────────────────────────────────────────────────────────────────────
router.get  ('/:id/polls', protect, getPolls);
router.post ('/:id/polls', protect, restrictTo('instructor', 'admin'), createPoll);
router.post ('/:id/polls/:pId/vote', protect, votePoll);
router.patch('/:id/polls/:pId/close', protect, restrictTo('instructor', 'admin'), closePoll);

// ─── Quizzes ──────────────────────────────────────────────────────────────────
router.get  ('/:id/quizzes', protect, getQuizzes);
router.post ('/:id/quizzes', protect, restrictTo('instructor', 'admin'), createQuiz);
router.patch('/:id/quizzes/:qzId/start', protect, restrictTo('instructor', 'admin'), startQuiz);
router.post ('/:id/quizzes/:qzId/submit', protect, submitQuizAttempt);

// ─── Resources ────────────────────────────────────────────────────────────────
router.get   ('/:id/resources', protect, getResources);
router.post  ('/:id/resources', protect, restrictTo('instructor', 'admin'), uploadResource);
router.delete('/:id/resources/:rId', protect, restrictTo('instructor', 'admin'), deleteResource);

// ─── Certificates Specific ────────────────────────────────────────────────────
router.post('/:id/certificates', protect, generateCertificate);

module.exports = router;
