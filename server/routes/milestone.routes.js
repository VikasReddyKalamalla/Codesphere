const express = require('express');
const router  = express.Router();

const {
  getMilestoneById,
  createMilestone,
  updateMilestone,
  completeMilestone,
  deleteMilestone,
} = require('../controllers/milestone.controller');

const { protect } = require('../middlewares/auth.middleware');

// ─── Milestone CRUD ───────────────────────────────────────────────────────────
router.get   ('/:id',           protect, getMilestoneById);
router.post  ('/',              protect, createMilestone);
router.put   ('/:id',           protect, updateMilestone);
router.patch ('/:id/complete',  protect, completeMilestone);
router.delete('/:id',           protect, deleteMilestone);

module.exports = router;
