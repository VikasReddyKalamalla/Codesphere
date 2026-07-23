const Invoice           = require('../models/Invoice');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getMyInvoices = async (userId, { page = 1, limit = 10 }) => {
  const total = await Invoice.countDocuments({ userId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const invoices = await Invoice.find({ userId })
    .sort({ invoiceDate: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, invoices };
};

const getInvoiceById = async (invoiceId, userId) => {
  const invoice = await Invoice.findById(invoiceId)
    .populate('userId', 'fullName email')
    .populate('billingId');

  if (!invoice) throw createError('Invoice not found', 404);
  if (invoice.userId._id.toString() !== userId.toString()) {
    throw createError('You are not authorized to view this invoice', 403);
  }

  return invoice;
};

const downloadInvoice = async (invoiceId, userId) => {
  const invoice = await Invoice.findById(invoiceId).populate('userId', 'fullName email');

  if (!invoice) throw createError('Invoice not found', 404);
  if (invoice.userId._id.toString() !== userId.toString()) {
    throw createError('You are not authorized to download this invoice', 403);
  }

  // Mock invoice download — in production, generate PDF here
  return {
    message:       'Invoice download link generated (mock)',
    invoiceNumber: invoice.invoiceNumber,
    downloadUrl:   `/invoices/${invoice.invoiceNumber}.pdf`,
    invoice,
  };
};

module.exports = { getMyInvoices, getInvoiceById, downloadInvoice };
