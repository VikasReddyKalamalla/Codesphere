const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const dsa = require('../controllers/dsa.controller');

// All DSA routes require authentication
router.use(protect);

// ─── Topics ───────────────────────────────────────────────────────────────────
router.get('/topics',          dsa.getTopics);
router.get('/topics/:slug',    dsa.getTopicBySlug);

// ─── Problems ─────────────────────────────────────────────────────────────────
router.get('/problems/:slug',                dsa.getProblemBySlug);
router.get('/problems/:slug/editorial',      dsa.getEditorial);
router.post('/problems/:slug/unlock-editorial', dsa.unlockEditorial);
router.post('/problems/:slug/run',           dsa.runCode);
router.post('/problems/:slug/submit',        dsa.submitCode);
router.get('/problems/:slug/submissions',    dsa.getSubmissions);
router.put('/problems/:slug/progress',       dsa.updateProgress);
router.put('/problems/:slug/notes',          dsa.saveNotes);

// ─── Dashboard & Progress ─────────────────────────────────────────────────────
router.get('/dashboard',    dsa.getDashboard);
router.get('/revision',     dsa.getRevision);
router.get('/bookmarks',    dsa.getBookmarks);

// ─── Search ───────────────────────────────────────────────────────────────────
router.get('/search',       dsa.searchDSA);

// ─── Patterns ─────────────────────────────────────────────────────────────────
router.get('/patterns',         dsa.getPatterns);
router.get('/patterns/:slug',   dsa.getProblemsByPattern);

// ─── Achievements ─────────────────────────────────────────────────────────────
router.get('/achievements',     dsa.getAchievements);

module.exports = router;
