const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const organizationService = require('../services/organization.service');

const getMyOrganization = asyncHandler(async (req, res) => {
  const data = await organizationService.getMyOrganization(req.user._id);
  return successResponse(res, 200, 'Organization details fetched successfully', data);
});

const inviteMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const data = await organizationService.inviteMember(req.user._id, email, role);
  return successResponse(res, 200, 'Member invited successfully', data);
});

const verifyUniversity = asyncHandler(async (req, res) => {
  const { domain, universityName, contactPerson, contactEmail } = req.body;
  const data = await organizationService.verifyUniversityDomain(domain, universityName, contactPerson, contactEmail);
  return successResponse(res, 200, 'University verification submitted successfully', data);
});

module.exports = {
  getMyOrganization,
  inviteMember,
  verifyUniversity,
};
