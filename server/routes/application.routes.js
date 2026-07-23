const express = require('express');
const router  = express.Router();

const {
  submitApplication,
  getMyApplication,
  updateApplication,
  cancelApplication,
  getAllApplications,
  reviewApplication,
} = require('../controllers/application.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Applicant operations ─────────────────────────────────────────────────────
router.post('/',          protect, submitApplication);
router.get('/me',         protect, getMyApplication);
router.put('/:id',        protect, updateApplication);
router.delete('/:id',     protect, cancelApplication);

// ─── Admin operations ─────────────────────────────────────────────────────────
router.get('/',             protect, restrictTo('admin'), getAllApplications);
router.put('/:id/review',   protect, restrictTo('admin'), reviewApplication);

module.exports = router;
