const BillingHistory    = require('../models/BillingHistory');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getMyBillingHistory = async (userId, { page = 1, limit = 10 }) => {
  const total = await BillingHistory.countDocuments({ userId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const billings = await BillingHistory.find({ userId })
    .populate('planId', 'displayName')
    .sort({ billingDate: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, billings };
};

const getBillingById = async (billingId, userId) => {
  const billing = await BillingHistory.findById(billingId)
    .populate('planId', 'displayName monthlyPrice yearlyPrice')
    .populate('subscriptionId');

  if (!billing) throw createError('Billing record not found', 404);
  if (billing.userId.toString() !== userId.toString()) {
    throw createError('You are not authorized to view this billing record', 403);
  }

  return billing;
};

module.exports = { getMyBillingHistory, getBillingById };
