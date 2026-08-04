const express = require('express');
const router  = express.Router();
const {
  getAllPaths,
  getPathById,
  createPath,
  updatePath,
  deletePath,
  markProgress,
  getProgress,
  getAllProgress,
  enroll,
  unenroll,
} = require('../controllers/learning.controller');

const { protect, optionalAuth } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Progress (must be BEFORE /:id to avoid route conflict) ──────────────────
router.post('/progress',                 protect, markProgress);
router.get ('/progress',                 protect, getAllProgress);
router.get ('/progress/:learningPathId', protect, getProgress);

// ─── Enrollment ───────────────────────────────────────────────────────────────
router.post('/:id/enroll',   protect, enroll);
router.delete('/:id/enroll', protect, unenroll);

// ─── Learning Paths ───────────────────────────────────────────────────────────
router.get   ('/',    optionalAuth, getAllPaths);
router.post  ('/',    protect, restrictTo('instructor', 'admin'), createPath);
router.get   ('/:id', optionalAuth, getPathById);
router.put   ('/:id', protect, restrictTo('instructor', 'admin'), updatePath);
router.delete('/:id', protect, restrictTo('admin'), deletePath);

module.exports = router;
