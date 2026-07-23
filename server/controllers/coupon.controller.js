const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const couponService = require('../services/coupon.service');

const validateCoupon = asyncHandler(async (req, res) => {
  const { code, amount, planName, isStudent } = req.body;
  const result = await couponService.validateCoupon(code, amount, planName, isStudent);
  return successResponse(res, 200, 'Coupon applied successfully', result);
});

const getActiveCoupons = asyncHandler(async (req, res) => {
  const coupons = await couponService.getActiveCoupons();
  return successResponse(res, 200, 'Active coupons fetched successfully', coupons);
});

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  return successResponse(res, 201, 'Coupon created successfully', coupon);
});

module.exports = {
  validateCoupon,
  getActiveCoupons,
  createCoupon,
};
