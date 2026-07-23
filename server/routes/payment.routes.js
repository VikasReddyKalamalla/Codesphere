const express = require('express');
const router  = express.Router();

const { getMyPayments, getPaymentById } = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth.middleware');

// ─── Payment APIs ─────────────────────────────────────────────────────────────
router.get('/',    protect, getMyPayments);
router.get('/:id', protect, getPaymentById);

module.exports = router;
