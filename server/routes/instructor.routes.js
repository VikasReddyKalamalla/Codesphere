const express = require('express');
const router  = express.Router();

const {
  getAllInstructors,
  getMyProfile,
  getDashboard,
  getInstructorById,
  updateProfile,
} = require('../controllers/instructor.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/', getAllInstructors);
router.get('/:id', getInstructorById);

// ─── Authenticated instructor ─────────────────────────────────────────────────
router.get('/me/profile',   protect, restrictTo('instructor'), getMyProfile);
router.get('/me/dashboard', protect, restrictTo('instructor'), getDashboard);
router.put('/profile',      protect, restrictTo('instructor'), updateProfile);

module.exports = router;
