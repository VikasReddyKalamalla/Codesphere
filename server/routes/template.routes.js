const express = require('express');
const router  = express.Router();

const {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  renderTemplate,
} = require('../controllers/template.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Public read ─────────────────────────────────────────────────────────────
router.get('/',    protect, getAllTemplates);
router.get('/:id', protect, getTemplateById);

// ─── Admin-only write operations ─────────────────────────────────────────────
router.post('/',             protect, restrictTo('admin'), createTemplate);
router.put('/:id',           protect, restrictTo('admin'), updateTemplate);
router.delete('/:id',        protect, restrictTo('admin'), deleteTemplate);
router.post('/:id/render',   protect, renderTemplate);

module.exports = router;
