const express = require('express');
const router  = express.Router();

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/eventCategory.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Event Category CRUD ──────────────────────────────────────────────────────
router.get   ('/',    getAllCategories);
router.get   ('/:id', getCategoryById);
router.post  ('/',    protect, restrictTo('admin'), createCategory);
router.put   ('/:id', protect, restrictTo('admin'), updateCategory);
router.delete('/:id', protect, restrictTo('admin'), deleteCategory);

module.exports = router;
