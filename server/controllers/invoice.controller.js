const asyncHandler      = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const invoiceService    = require('../services/invoice.service');

const getMyInvoices  = asyncHandler(async (req, res) => successResponse(res, 200, 'Invoices fetched successfully', await invoiceService.getMyInvoices(req.user._id, req.query)));
const getInvoiceById = asyncHandler(async (req, res) => successResponse(res, 200, 'Invoice fetched successfully', await invoiceService.getInvoiceById(req.params.id, req.user._id)));
const downloadInvoice = asyncHandler(async (req, res) => successResponse(res, 200, 'Invoice download link generated', await invoiceService.downloadInvoice(req.params.id, req.user._id)));

module.exports = { getMyInvoices, getInvoiceById, downloadInvoice };
