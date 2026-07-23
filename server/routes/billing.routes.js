const express = require('express');
const router  = express.Router();

const { getMyBillingHistory, getBillingById } = require('../controllers/billing.controller');
const { protect } = require('../middlewares/auth.middleware');

// ─── Billing APIs ─────────────────────────────────────────────────────────────
router.get('/',    protect, getMyBillingHistory);
router.get('/:id', protect, getBillingById);

module.exports = router;
