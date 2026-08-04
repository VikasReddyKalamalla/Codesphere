const express = require('express');
const router  = express.Router();

const {
  getAllTests, getMyTests, getTestById, getTestBySlug,
  createTest, updateTest, deleteTest, publishTest, archiveTest, getTestAnalytics,
  getLeaderboard: getGlobalLeaderboard, getContests, submitTestAttempt
} = require('../controllers/test.controller');

const { getTestQuestions }                        = require('../controllers/question.controller');
const { startTest, pauseTest, resumeTest, saveAnswer, submitTest, getTestResults } = require('../controllers/testAttempt.controller');
const { getLeaderboard, getMyRank }               = require('../controllers/leaderboard.controller');
const { addBookmark, removeBookmark, getUserBookmarks, isBookmarked } = require('../controllers/testBookmark.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Test CRUD & Feeds ────────────────────────────────────────────────────────
router.get   ('/',              getAllTests);
router.get   ('/leaderboard',   getGlobalLeaderboard);
router.get   ('/global-leaderboard', getGlobalLeaderboard);
router.get   ('/contests',      getContests);
router.get   ('/my',            protect, getMyTests);
router.get   ('/my/bookmarks',  protect, getUserBookmarks);
router.get   ('/my/attempts',   protect, require('../controllers/testAttempt.controller').getMyAttempts);
router.get   ('/slug/:slug',    getTestBySlug);
router.get   ('/:id',           getTestById);
router.post  ('/:id/submit',    protect, submitTestAttempt);
router.post  ('/',              protect, restrictTo('instructor', 'admin'), createTest);
router.put   ('/:id',           protect, updateTest);
router.delete('/:id',           protect, deleteTest);

// ─── Lifecycle ────────────────────────────────────────────────────────────────
router.patch('/:id/publish', protect, publishTest);
router.patch('/:id/archive', protect, archiveTest);

// ─── Analytics ────────────────────────────────────────────────────────────────
router.get('/:id/analytics', protect, getTestAnalytics);
router.get('/:id/results',   protect, getTestResults);

// ─── Questions (test-scoped) ──────────────────────────────────────────────────
router.get('/:id/questions', protect, getTestQuestions);

// ─── Attempts ─────────────────────────────────────────────────────────────────
router.post('/:id/start',   protect, startTest);
router.put ('/:id/pause',   protect, pauseTest);
router.put ('/:id/resume',  protect, resumeTest);
router.post('/:id/answer',  protect, saveAnswer);
router.post('/:id/submit',  protect, submitTest);

// ─── Leaderboard ──────────────────────────────────────────────────────────────
router.get('/:id/leaderboard', getLeaderboard);
router.get('/:id/my-rank',     protect, getMyRank);

// ─── Bookmarks ────────────────────────────────────────────────────────────────
router.post  ('/:id/bookmark',        protect, addBookmark);
router.delete('/:id/bookmark',        protect, removeBookmark);
router.get   ('/:id/bookmark-status', protect, isBookmarked);

module.exports = router;
