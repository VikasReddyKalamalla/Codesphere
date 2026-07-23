const express = require('express');
const router = express.Router();
const { validateCoupon, getActiveCoupons, createCoupon } = require('../controllers/coupon.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.post('/validate', protect, validateCoupon);
router.get('/active', protect, getActiveCoupons);
router.post('/admin/create', protect, restrictTo('admin'), createCoupon);

module.exports = router;
