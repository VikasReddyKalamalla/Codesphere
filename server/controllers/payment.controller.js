const asyncHandler      = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const paymentService    = require('../services/payment.service');

const getMyPayments = asyncHandler(async (req, res) => {
  const data = await paymentService.getMyPayments(req.user._id, req.query);
  return successResponse(res, 200, 'Payments fetched successfully', data);
});

const getPaymentById = asyncHandler(async (req, res) => {
  const data = await paymentService.getPaymentById(req.params.id, req.user._id);
  return successResponse(res, 200, 'Payment fetched successfully', data);
});

const createStripeCheckoutSession = asyncHandler(async (req, res) => {
  const data = await paymentService.createStripeCheckoutSession(req.user._id, req.body);
  return successResponse(res, 200, 'Stripe checkout session created successfully', data);
});

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const data = await paymentService.createRazorpayOrder(req.user._id, req.body);
  return successResponse(res, 200, 'Razorpay order created successfully', data);
});

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const data = await paymentService.verifyRazorpaySignature(req.user._id, req.body);
  return successResponse(res, 200, 'Razorpay payment verified successfully', data);
});

const handleWebhook = asyncHandler(async (req, res) => {
  const data = await paymentService.handleWebhookEvent(req);
  return successResponse(res, 200, 'Webhook processed successfully', data);
});

const downloadInvoicePDF = asyncHandler(async (req, res) => {
  const pdfBuffer = await paymentService.getInvoicePDFBuffer(req.params.invoiceId, req.user._id);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Invoice-${req.params.invoiceId}.pdf"`);
  res.send(pdfBuffer);
});

module.exports = {
  getMyPayments,
  getPaymentById,
  createStripeCheckoutSession,
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleWebhook,
  downloadInvoicePDF,
};
