const asyncHandler             = require('../utils/asyncHandler');
const { successResponse }      = require('../utils/apiResponse');
const eventCertificateService  = require('../services/eventCertificate.service');

// POST /api/events/:id/certificates
const issueCertificate = asyncHandler(async (req, res) => {
  const data = await eventCertificateService.issueCertificate(req.params.id, req.body, req.user._id, req.user.role);
  return successResponse(res, 201, 'Certificate issued successfully', data);
});

// GET /api/events/:id/certificates
const getEventCertificates = asyncHandler(async (req, res) => {
  const data = await eventCertificateService.getEventCertificates(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Certificates fetched successfully', data);
});

// GET /api/events/my/certificates
const getMyCertificates = asyncHandler(async (req, res) => {
  const data = await eventCertificateService.getMyCertificates(req.user._id);
  return successResponse(res, 200, 'Your certificates fetched successfully', data);
});

module.exports = { issueCertificate, getEventCertificates, getMyCertificates };
