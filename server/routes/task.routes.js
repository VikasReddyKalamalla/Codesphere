const express = require('express');
const router  = express.Router();

const {
  getMyTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');

const {
  getTaskComments,
  addComment,
} = require('../controllers/taskComment.controller');

const {
  getTaskAttachments,
  uploadAttachment,
} = require('../controllers/taskAttachment.controller');

const { protect } = require('../middlewares/auth.middleware');

// ─── Task CRUD ────────────────────────────────────────────────────────────────
router.get   ('/my',  protect, getMyTasks);
router.get   ('/:id', protect, getTaskById);
router.post  ('/',    protect, createTask);
router.put   ('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

// ─── Comments (task-scoped) ───────────────────────────────────────────────────
router.get ('/:id/comments', protect, getTaskComments);
router.post('/:id/comments', protect, addComment);

// ─── Attachments (task-scoped) ────────────────────────────────────────────────
router.get ('/:id/attachments', protect, getTaskAttachments);
router.post('/:id/attachments', protect, uploadAttachment);

module.exports = router;
