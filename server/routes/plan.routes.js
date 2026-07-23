const express = require('express');
const router  = express.Router();

const { getAllPlans, getPlanById, createPlan, updatePlan, deletePlan } = require('../controllers/subscriptionPlan.controller');
const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Plan APIs ────────────────────────────────────────────────────────────────
router.get   ('/',    getAllPlans);
router.get   ('/:id', getPlanById);
router.post  ('/',    protect, restrictTo('admin'), createPlan);
router.put   ('/:id', protect, restrictTo('admin'), updatePlan);
router.delete('/:id', protect, restrictTo('admin'), deletePlan);

module.exports = router;
