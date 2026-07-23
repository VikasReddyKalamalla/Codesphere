const express = require('express');
const router  = express.Router();
const {
  getModulesByPath,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} = require('../controllers/module.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.get   ('/:learningPathId',  protect, getModulesByPath);
router.get   ('/single/:id',       protect, getModuleById);
router.post  ('/',                 protect, restrictTo('instructor', 'admin'), createModule);
router.put   ('/:id',              protect, restrictTo('instructor', 'admin'), updateModule);
router.delete('/:id',              protect, restrictTo('admin'), deleteModule);

module.exports = router;
