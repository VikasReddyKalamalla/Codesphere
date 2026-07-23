const express = require('express');
const router  = express.Router();
const {
  getLessonsByModule,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/lesson.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.get   ('/:moduleId',   protect, getLessonsByModule);
router.get   ('/single/:id',  protect, getLessonById);
router.post  ('/',            protect, restrictTo('instructor', 'admin'), createLesson);
router.put   ('/:id',         protect, restrictTo('instructor', 'admin'), updateLesson);
router.delete('/:id',         protect, restrictTo('admin'), deleteLesson);

module.exports = router;
