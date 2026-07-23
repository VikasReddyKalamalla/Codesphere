const express = require('express');
const router  = express.Router();
const {
  getPostsByCommunity,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark,
  togglePin,
} = require('../controllers/post.controller');

const { protect } = require('../middlewares/auth.middleware');

router.get   ('/:communityId', protect, getPostsByCommunity);
router.get   ('/single/:id',   protect, getPostById);
router.post  ('/',             protect, createPost);
router.put   ('/:id',          protect, updatePost);
router.delete('/:id',          protect, deletePost);

// ─── Interactions ─────────────────────────────────────────────────────────────
router.post('/:id/like',     protect, toggleLike);
router.post('/:id/bookmark', protect, toggleBookmark);
router.post('/:id/pin',      protect, togglePin);

module.exports = router;
