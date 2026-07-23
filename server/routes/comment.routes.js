const express = require('express');
const router  = express.Router();
const {
  getCommentsByPost,
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} = require('../controllers/comment.controller');

const { protect } = require('../middlewares/auth.middleware');

router.get   ('/:postId', protect, getCommentsByPost);
router.post  ('/',        protect, addComment);
router.put   ('/:id',     protect, updateComment);
router.delete('/:id',     protect, deleteComment);
router.post  ('/:id/like', protect, toggleCommentLike);

module.exports = router;
