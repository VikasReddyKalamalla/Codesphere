const express = require('express');
const router  = express.Router();

const {
  getAllPlans,
  getMySubscriptions,
  getCurrentSubscription,
  createSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  getMyInvoices,
} = require('../controllers/subscription.controller');

const { protect } = require('../middlewares/auth.middleware');

router.get('/plans',                getAllPlans);
router.get('/',                     protect, getMySubscriptions);
router.get('/current',              protect, getCurrentSubscription);
router.post('/',                    protect, createSubscription);
router.put('/pause',                protect, pauseSubscription);
router.put('/resume',               protect, resumeSubscription);
router.delete('/cancel',            protect, cancelSubscription);
router.get('/invoices',             protect, getMyInvoices);

module.exports = router;
