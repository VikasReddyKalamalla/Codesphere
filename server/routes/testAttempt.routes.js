const express = require('express');
const router  = express.Router();

const { getAttemptResult } = require('../controllers/testAttempt.controller');
const { protect } = require('../middlewares/auth.middleware');

// ─── Attempt result (direct attempt access) ───────────────────────────────────
router.get('/:id', protect, getAttemptResult);

module.exports = router;
