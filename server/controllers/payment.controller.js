const asyncHandler      = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const paymentService    = require('../services/payment.service');

const getMyPayments  = asyncHandler(async (req, res) => successResponse(res, 200, 'Payments fetched successfully', await paymentService.getMyPayments(req.user._id, req.query)));
const getPaymentById = asyncHandler(async (req, res) => successResponse(res, 200, 'Payment fetched successfully', await paymentService.getPaymentById(req.params.id, req.user._id)));

module.exports = { getMyPayments, getPaymentById };
