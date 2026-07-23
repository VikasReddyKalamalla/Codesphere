const express = require('express');
const router  = express.Router();
const { getUserBookmarks } = require('../controllers/bookmark.controller');
const { protect } = require('../middlewares/auth.middleware');

// GET /api/bookmarks  (user's saved resources)
router.get('/', protect, getUserBookmarks);

module.exports = router;
