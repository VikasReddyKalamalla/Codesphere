const express = require('express');
const router  = express.Router();

const { getMyInvoices, getInvoiceById, downloadInvoice } = require('../controllers/invoice.controller');
const { protect } = require('../middlewares/auth.middleware');

// ─── Invoice APIs ─────────────────────────────────────────────────────────────
router.get('/download/:id', protect, downloadInvoice);
router.get('/',             protect, getMyInvoices);
router.get('/:id',          protect, getInvoiceById);

module.exports = router;
