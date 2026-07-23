const express = require('express');
const router = express.Router();
const { getMyReferrals } = require('../controllers/referral.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/my-referrals', protect, getMyReferrals);

module.exports = router;
