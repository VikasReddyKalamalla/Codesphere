const express = require('express');
const router  = express.Router();

const { deleteAttachment } = require('../controllers/taskAttachment.controller');
const { protect } = require('../middlewares/auth.middleware');

// ─── Attachment deletion (direct access via attachment ID) ────────────────────
router.delete('/:id', protect, deleteAttachment);

module.exports = router;
