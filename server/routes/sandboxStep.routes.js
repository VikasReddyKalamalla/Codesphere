const express = require('express');
const router  = express.Router();

const { getStepById, createStep, updateStep, deleteStep } = require('../controllers/sandboxStep.controller');
const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Step CRUD (direct step access) ──────────────────────────────────────────
router.get   ('/:id', getStepById);
router.post  ('/',    protect, restrictTo('instructor', 'admin'), createStep);
router.put   ('/:id', protect, updateStep);
router.delete('/:id', protect, deleteStep);

module.exports = router;
