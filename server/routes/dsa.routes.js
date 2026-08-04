const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middlewares/auth.middleware');
const dsa = require('../controllers/dsa.controller');

// ─── Read/View Routes (Accessible with or without login token) ────────────────
router.get('/topics',                       optionalAuth, dsa.getTopics);
router.get('/topics/:slug',                 optionalAuth, dsa.getTopicBySlug);
router.get('/problems/:slug',               optionalAuth, dsa.getProblemBySlug);
router.get('/problems/:slug/submissions',   optionalAuth, dsa.getSubmissions);
router.get('/dashboard',                    optionalAuth, dsa.getDashboard);
router.get('/revision',                     optionalAuth, dsa.getRevisionList);
router.get('/bookmarks',                    optionalAuth, dsa.getBookmarks);
router.get('/search',                       optionalAuth, dsa.searchDSA);
router.get('/achievements',                 optionalAuth, dsa.getAchievements);
router.get('/github-streak/:username',      optionalAuth, dsa.getGitHubStreak);

// ─── Write/Action Routes (Require login token / optional for trial) ────────────
router.post('/simulate-activity',             optionalAuth, dsa.simulateActivity);
router.post('/problems/:slug/unlock-editorial', optionalAuth, dsa.unlockEditorial);
router.post('/problems/:slug/run',              optionalAuth, dsa.runCode);
router.post('/problems/:slug/submit',           optionalAuth, dsa.submitCode);
router.put('/problems/:slug/notes',             optionalAuth, dsa.saveNotes);
router.post('/problems/:slug/bookmark',         optionalAuth, dsa.toggleBookmark);

module.exports = router;
