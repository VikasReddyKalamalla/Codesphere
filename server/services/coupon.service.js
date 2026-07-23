const Coupon = require('../models/Coupon');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const validateCoupon = async (code, amount, planName, isStudent = false) => {
  if (!code) throw createError('Coupon code is required', 400);

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw createError('Invalid or expired coupon code', 404);

  if (new Date() > new Date(coupon.validUntil)) {
    throw createError('This coupon code has expired', 400);
  }

  if (coupon.usedCount >= coupon.maxUses) {
    throw createError('This coupon limit has been reached', 400);
  }

  if (coupon.minPurchaseAmount > 0 && amount < coupon.minPurchaseAmount) {
    throw createError(`Minimum order amount of ₹${coupon.minPurchaseAmount} required for this coupon`, 400);
  }

  if (coupon.isStudentOnly && !isStudent) {
    throw createError('This coupon is reserved exclusively for verified student accounts', 403);
  }

  if (coupon.applicablePlans && coupon.applicablePlans.length > 0 && !coupon.applicablePlans.includes(planName)) {
    throw createError(`Coupon is not valid for the selected plan (${planName})`, 400);
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (amount * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount > 0 && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, amount);
  const finalAmount = Math.max(0, amount - discount);

  return {
    code: coupon.code,
    title: coupon.title,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount: Math.round(discount),
    finalAmount: Math.round(finalAmount),
    valid: true,
  };
};

const getActiveCoupons = async () => {
  return Coupon.find({ isActive: true, validUntil: { $gte: new Date() } }).sort({ createdAt: -1 });
};

const createCoupon = async (data) => {
  return Coupon.create(data);
};

module.exports = {
  validateCoupon,
  getActiveCoupons,
  createCoupon,
};
