const express = require('express');
const router  = express.Router();
const { deleteReminder }  = require('../controllers/reminder.controller');
const { protect }         = require('../middlewares/auth.middleware');

// DELETE /api/reminders/:id
router.delete('/:id', protect, deleteReminder);

module.exports = router;
