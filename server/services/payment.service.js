const Payment           = require('../models/Payment');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getMyPayments = async (userId, { page = 1, limit = 10 }) => {
  const total = await Payment.countDocuments({ userId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const payments = await Payment.find({ userId })
    .populate('invoiceId', 'invoiceNumber total')
    .sort({ paidAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, payments };
};

const getPaymentById = async (paymentId, userId) => {
  const payment = await Payment.findById(paymentId)
    .populate('subscriptionId')
    .populate('invoiceId');

  if (!payment) throw createError('Payment not found', 404);
  if (payment.userId.toString() !== userId.toString()) {
    throw createError('You are not authorized to view this payment', 403);
  }

  return payment;
};

module.exports = { getMyPayments, getPaymentById };
