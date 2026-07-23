const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const certificateService = require('../services/instructorCertificate.service');

/**
 * GET /api/instructor-certificates
 * Get all certificates issued by the authenticated instructor.
 */
const getIssuedCertificates = asyncHandler(async (req, res) => {
  const result = await certificateService.getIssuedCertificates(req.user._id, req.query);
  successResponse(res, 200, 'Certificates fetched successfully', result);
});

/**
 * POST /api/instructor-certificates
 * Issue a certificate to a student.
 */
const issueCertificate = asyncHandler(async (req, res) => {
  const certificate = await certificateService.issueCertificate(req.user._id, req.body);
  successResponse(res, 201, 'Certificate issued successfully', { certificate });
});

/**
 * DELETE /api/instructor-certificates/:id
 * Revoke a certificate.
 */
const revokeCertificate = asyncHandler(async (req, res) => {
  const result = await certificateService.revokeCertificate(
    req.user._id,
    req.params.id,
    req.body.revokeReason
  );
  successResponse(res, 200, result.message, { certificate: result.certificate });
});

/**
 * GET /api/instructor-certificates/verify/:certificateNumber
 * Publicly verify a certificate by its certificate number.
 */
const verifyCertificate = asyncHandler(async (req, res) => {
  const result = await certificateService.verifyCertificate(req.params.certificateNumber);
  successResponse(res, 200, result.valid ? 'Certificate is valid' : 'Certificate is revoked', result);
});

module.exports = {
  getIssuedCertificates,
  issueCertificate,
  revokeCertificate,
  verifyCertificate,
};
