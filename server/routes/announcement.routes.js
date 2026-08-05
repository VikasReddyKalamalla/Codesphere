const express = require('express');
const router = express.Router();

const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  broadcastAnnouncement,
  updateAnnouncement,
  togglePinAnnouncement,
  likeAnnouncement,
  repostAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcement.controller');

const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// Public/Authenticated reading & interactions
router.get('/', protect, getAllAnnouncements);
router.get('/:id', protect, getAnnouncementById);
router.post('/:id/like', protect, likeAnnouncement);
router.post('/:id/repost', protect, repostAnnouncement);

// Admin-only creation, editing, pinning, and deletion
router.post('/', protect, restrictTo('admin'), createAnnouncement);
router.post('/:id/broadcast', protect, restrictTo('admin'), broadcastAnnouncement);
router.post('/:id/pin', protect, restrictTo('admin'), togglePinAnnouncement);
router.put('/:id', protect, restrictTo('admin'), updateAnnouncement);
router.delete('/:id', protect, restrictTo('admin'), deleteAnnouncement);

module.exports = router;
