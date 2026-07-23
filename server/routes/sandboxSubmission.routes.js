const express = require('express');
const router  = express.Router();

const { updateSubmission, deleteSubmission, reviewSubmission } = require('../controllers/sandboxSubmission.controller');
const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Submission mutation (direct submission access) ───────────────────────────
router.put   ('/:id',        protect, updateSubmission);
router.delete('/:id',        protect, deleteSubmission);
router.put   ('/:id/review', protect, restrictTo('instructor', 'admin'), reviewSubmission);

module.exports = router;
