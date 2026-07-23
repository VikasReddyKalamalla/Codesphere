const express = require('express');
const router  = express.Router();
const { getUserDownloads } = require('../controllers/download.controller');
const { protect } = require('../middlewares/auth.middleware');

// GET /api/downloads/me  (user's download history)
router.get('/me', protect, getUserDownloads);

module.exports = router;
