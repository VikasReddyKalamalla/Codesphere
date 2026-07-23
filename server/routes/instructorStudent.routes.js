const express = require('express');
const router  = express.Router();

const {
  getStudents,
  getStudentDetail,
} = require('../controllers/instructorStudent.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.get('/',    protect, restrictTo('instructor', 'admin'), getStudents);
router.get('/:id', protect, restrictTo('instructor', 'admin'), getStudentDetail);

module.exports = router;
