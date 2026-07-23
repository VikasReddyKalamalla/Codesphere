const express = require('express');
const router  = express.Router();

const {
  editComment,
  deleteComment,
  getReplies,
} = require('../controllers/taskComment.controller');

const { protect } = require('../middlewares/auth.middleware');

// ─── Comment Mutation (direct access via comment ID) ─────────────────────────
router.put   ('/:id',         protect, editComment);
router.delete('/:id',         protect, deleteComment);
router.get   ('/:id/replies', protect, getReplies);

module.exports = router;
