const express = require('express');
const router  = express.Router();
const { deleteRecording } = require('../controllers/recording.controller');
const { protect }         = require('../middlewares/auth.middleware');

// DELETE /api/recordings/:id
router.delete('/:id', protect, deleteRecording);

module.exports = router;
