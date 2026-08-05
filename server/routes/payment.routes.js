const express = require('express');
const router  = express.Router();

const {
  getMyPayments,
  getPaymentById,
  createStripeCheckoutSession,
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleWebhook,
  downloadInvoicePDF,
} = require('../controllers/payment.controller');

const { protect } = require('../middlewares/auth.middleware');

// ─── Webhooks ─────────────────────────────────────────────────────────────────
router.post('/webhook', express.json(), handleWebhook);

// ─── Payment Gateway Integrations ─────────────────────────────────────────────
router.post('/stripe/checkout-session', protect, createStripeCheckoutSession);
router.post('/razorpay/order',            protect, createRazorpayOrder);
router.post('/razorpay/verify',           protect, verifyRazorpayPayment);

// ─── Invoices & Billing Records ───────────────────────────────────────────────
router.get('/invoices/:invoiceId/download', protect, downloadInvoicePDF);
router.get('/',                            protect, getMyPayments);
router.get('/:id',                         protect, getPaymentById);

module.exports = router;
