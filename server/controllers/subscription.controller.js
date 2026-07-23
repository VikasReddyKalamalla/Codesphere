const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const subscriptionService = require('../services/subscription.service');

const getAllPlans = asyncHandler(async (req, res) => {
  const data = await subscriptionService.getAllPlans();
  return successResponse(res, 200, 'Plans fetched successfully', data);
});

const getMySubscriptions = asyncHandler(async (req, res) => {
  const data = await subscriptionService.getMySubscriptions(req.user._id, req.query);
  return successResponse(res, 200, 'Subscription history fetched successfully', data);
});

const getCurrentSubscription = asyncHandler(async (req, res) => {
  const data = await subscriptionService.getCurrentSubscription(req.user._id);
  return successResponse(res, 200, 'Current subscription fetched successfully', data);
});

const createSubscription = asyncHandler(async (req, res) => {
  const data = await subscriptionService.createSubscription(req.user._id, req.body);
  return successResponse(res, 201, 'Subscription created successfully', data);
});

const pauseSubscription = asyncHandler(async (req, res) => {
  const data = await subscriptionService.pauseSubscription(req.user._id);
  return successResponse(res, 200, 'Subscription paused successfully', data);
});

const resumeSubscription = asyncHandler(async (req, res) => {
  const data = await subscriptionService.resumeSubscription(req.user._id);
  return successResponse(res, 200, 'Subscription resumed successfully', data);
});

const cancelSubscription = asyncHandler(async (req, res) => {
  const data = await subscriptionService.cancelSubscription(req.user._id, req.body?.reason);
  return successResponse(res, 200, 'Subscription cancelled successfully', data);
});

const getMyInvoices = asyncHandler(async (req, res) => {
  const data = await subscriptionService.getMyInvoices(req.user._id);
  return successResponse(res, 200, 'Invoices fetched successfully', data);
});

module.exports = {
  getAllPlans,
  getMySubscriptions,
  getCurrentSubscription,
  createSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  getMyInvoices,
};
