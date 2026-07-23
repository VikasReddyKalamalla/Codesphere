const express = require('express');
const router  = express.Router();

const { deleteReminder } = require('../controllers/eventReminder.controller');
const { protect } = require('../middlewares/auth.middleware');

// ─── Event Reminder Management ────────────────────────────────────────────────
// Note: Create and Get reminders are in event.routes.js under /:id/reminder
router.delete('/:id', protect, deleteReminder);

module.exports = router;
