const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const sessionCertificateService = require('../services/sessionCertificate.service');

const getCertificates = asyncHandler(async (req, res) => {
  const data = await sessionCertificateService.getCertificates(req.user._id);
  return successResponse(res, 200, 'Certificates retrieved successfully', data);
});

const generateCertificate = asyncHandler(async (req, res) => {
  const data = await sessionCertificateService.generateCertificate(req.params.id, req.user._id);
  return successResponse(res, 201, 'Certificate generated successfully', data);
});

module.exports = {
  getCertificates,
  generateCertificate,
};
