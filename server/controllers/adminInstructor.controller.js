const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const instructorService = require('../services/adminInstructor.service');

const getAllInstructors = asyncHandler(async (req, res) => {
  const result = await instructorService.getAllInstructors(req.query);
  successResponse(res, 200, 'Instructors fetched', result);
});

const approveApplication = asyncHandler(async (req, res) => {
  const application = await instructorService.approveApplication(
    req.params.id,
    req.user._id,
    req.body.adminRemarks
  );
  successResponse(res, 200, 'Application approved', { application });
});

const rejectApplication = asyncHandler(async (req, res) => {
  const application = await instructorService.rejectApplication(
    req.params.id,
    req.user._id,
    req.body.adminRemarks
  );
  successResponse(res, 200, 'Application rejected', { application });
});

const suspendInstructor = asyncHandler(async (req, res) => {
  const result = await instructorService.suspendInstructor(
    req.params.id,
    req.user._id,
    req.body.reason
  );
  successResponse(res, 200, result.message, { instructor: result.instructor });
});

const removeInstructor = asyncHandler(async (req, res) => {
  const result = await instructorService.removeInstructor(req.params.id, req.user._id);
  successResponse(res, 200, result.message, {});
});

const getAllApplications = asyncHandler(async (req, res) => {
  const result = await instructorService.getAllApplications(req.query);
  successResponse(res, 200, 'Applications fetched', result);
});

module.exports = {
  getAllInstructors,
  getAllApplications,
  approveApplication,
  rejectApplication,
  suspendInstructor,
  removeInstructor,
};
