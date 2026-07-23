const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const applicationService = require('../services/application.service');

/**
 * POST /api/instructor-applications
 * Submit a new instructor application.
 */
const submitApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.submitApplication(req.user._id, req.body);
  successResponse(res, 201, 'Application submitted successfully', { application });
});

/**
 * GET /api/instructor-applications/me
 * Get the authenticated user's own application.
 */
const getMyApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.getMyApplication(req.user._id);
  successResponse(res, 200, 'Application fetched', { application });
});

/**
 * PUT /api/instructor-applications/:id
 * Update a pending application (applicant only).
 */
const updateApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplication(
    req.params.id,
    req.user._id,
    req.body
  );
  successResponse(res, 200, 'Application updated successfully', { application });
});

/**
 * DELETE /api/instructor-applications/:id
 * Cancel a pending application.
 */
const cancelApplication = asyncHandler(async (req, res) => {
  const result = await applicationService.cancelApplication(req.params.id, req.user._id);
  successResponse(res, 200, result.message, {});
});

/**
 * GET /api/instructor-applications
 * Get all applications (Admin only).
 */
const getAllApplications = asyncHandler(async (req, res) => {
  const result = await applicationService.getAllApplications(req.query);
  successResponse(res, 200, 'Applications fetched', result);
});

/**
 * PUT /api/instructor-applications/:id/review
 * Approve or reject an application (Admin only).
 */
const reviewApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.reviewApplication(
    req.params.id,
    req.user._id,
    req.body
  );
  successResponse(res, 200, 'Application reviewed successfully', { application });
});

module.exports = {
  submitApplication,
  getMyApplication,
  updateApplication,
  cancelApplication,
  getAllApplications,
  reviewApplication,
};
