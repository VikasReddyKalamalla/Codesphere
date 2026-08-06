const express = require('express');
const router  = express.Router();

const {
  getAllInstructors,
  getMyProfile,
  getDashboard,
  getInstructorById,
  updateProfile,
  requestPayout,
  getPayouts,
  submitCourseApproval,
  approveCourse,
  rejectCourse,
} = require('../controllers/instructor.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/', getAllInstructors);

// ─── Authenticated instructor ─────────────────────────────────────────────────
router.get('/me/profile',               protect, restrictTo('instructor'), getMyProfile);
router.get('/me/dashboard',             protect, restrictTo('instructor'), getDashboard);
router.put('/profile',                  protect, restrictTo('instructor'), updateProfile);

// ─── Instructor Payout & Withdrawals ──────────────────────────────────────────
router.post('/payouts',                 protect, restrictTo('instructor'), requestPayout);
router.get('/payouts',                  protect, restrictTo('instructor'), getPayouts);

// ─── Course Verification & Admin Approval ─────────────────────────────────────
router.post('/courses/:id/submit-approval', protect, restrictTo('instructor'), submitCourseApproval);
router.put('/admin/courses/:id/approve',    protect, restrictTo('admin'),      approveCourse);
router.put('/admin/courses/:id/reject',     protect, restrictTo('admin'),      rejectCourse);

router.get('/:id', getInstructorById);

module.exports = router;
