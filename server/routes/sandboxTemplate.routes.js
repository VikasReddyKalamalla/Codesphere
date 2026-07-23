const express = require('express');
const router  = express.Router();

const { createTemplate, deleteTemplate, downloadTemplate } = require('../controllers/sandboxTemplate.controller');
const { getUserDownloads } = require('../controllers/sandboxDownload.controller');
const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Template management ──────────────────────────────────────────────────────
router.post  ('/',              protect, restrictTo('instructor', 'admin'), createTemplate);
router.delete('/:id',          protect, deleteTemplate);
router.post  ('/:id/download', protect, downloadTemplate);

// ─── Download history ─────────────────────────────────────────────────────────
router.get('/downloads', protect, getUserDownloads);

module.exports = router;
