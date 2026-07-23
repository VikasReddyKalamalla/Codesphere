const express = require('express');
const router  = express.Router();

const {
  getInstructorCourses,
  getCourseStats,
} = require('../controllers/instructorCourse.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.get('/',         protect, restrictTo('instructor', 'admin'), getInstructorCourses);
router.get('/:id/stats',protect, restrictTo('instructor', 'admin'), getCourseStats);

module.exports = router;
