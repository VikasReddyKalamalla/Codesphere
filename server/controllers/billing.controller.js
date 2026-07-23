const asyncHandler      = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const billingService    = require('../services/billing.service');

const getMyBillingHistory = asyncHandler(async (req, res) => successResponse(res, 200, 'Billing history fetched successfully', await billingService.getMyBillingHistory(req.user._id, req.query)));
const getBillingById      = asyncHandler(async (req, res) => successResponse(res, 200, 'Billing record fetched successfully', await billingService.getBillingById(req.params.id, req.user._id)));

module.exports = { getMyBillingHistory, getBillingById };
