const express = require('express');
const router  = express.Router();
const {
  getAllCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  getMembers,
  promoteModerator,
  removeModerator,
} = require('../controllers/community.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── CRUD ─────────────────────────────────────────────────────────────────────
router.get ('/',    protect, getAllCommunities);
router.get ('/:id', protect, getCommunityById);
router.post('/',    protect, createCommunity);
router.put ('/:id', protect, updateCommunity);
router.delete('/:id', protect, deleteCommunity);

// ─── Membership ───────────────────────────────────────────────────────────────
router.post  ('/:id/join',  protect, joinCommunity);
router.delete('/:id/leave', protect, leaveCommunity);
router.get   ('/:id/members', protect, getMembers);

// ─── Moderation ───────────────────────────────────────────────────────────────
router.post  ('/:id/moderators/:userId', protect, promoteModerator);
router.delete('/:id/moderators/:userId', protect, removeModerator);

module.exports = router;
