const express = require('express');
const router  = express.Router();

const {
  getNotifications,
  getUnreadCount,
  getNotificationStats,
  getNotificationById,
  createNotification,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = require('../controllers/notification.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Read ─────────────────────────────────────────────────────────────────────
router.get('/',             protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.get('/stats',        protect, getNotificationStats);
router.get('/:id',          protect, getNotificationById);

// ─── Create (Admin / internal services) ──────────────────────────────────────
router.post('/', protect, restrictTo('admin'), createNotification);

// ─── Mark read / unread ───────────────────────────────────────────────────────
router.put('/mark-all-read', protect, markAllAsRead);
router.put('/:id/read',      protect, markAsRead);
router.put('/:id/unread',    protect, markAsUnread);

// ─── Delete ───────────────────────────────────────────────────────────────────
router.delete('/',    protect, clearAllNotifications);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
