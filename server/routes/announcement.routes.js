const express = require('express');
const router  = express.Router();

const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  broadcastAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcement.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// All announcement management is admin-only
router.get   ('/',             protect, restrictTo('admin'), getAllAnnouncements);
router.get   ('/:id',          protect, restrictTo('admin'), getAnnouncementById);
router.post  ('/',             protect, restrictTo('admin'), createAnnouncement);
router.post  ('/:id/broadcast',protect, restrictTo('admin'), broadcastAnnouncement);
router.put   ('/:id',          protect, restrictTo('admin'), updateAnnouncement);
router.delete('/:id',          protect, restrictTo('admin'), deleteAnnouncement);

module.exports = router;
