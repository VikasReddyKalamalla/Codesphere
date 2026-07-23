const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'percentage',
    },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number, default: 0 }, // For percentage coupons
    minPurchaseAmount: { type: Number, default: 0 },
    applicablePlans: [{ type: String }], // e.g. ['student_pro', 'professional', 'team']
    maxUses: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isStudentOnly: { type: Boolean, default: false },
    isReferralCoupon: { type: Boolean, default: false },
    referrerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1, isActive: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
