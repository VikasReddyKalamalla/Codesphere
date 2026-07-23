const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const referralService = require('../services/referral.service');

const getMyReferrals = asyncHandler(async (req, res) => {
  const data = await referralService.getMyReferrals(req.user._id);
  return successResponse(res, 200, 'Referral data fetched successfully', data);
});

module.exports = {
  getMyReferrals,
};
