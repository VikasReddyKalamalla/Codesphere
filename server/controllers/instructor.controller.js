const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const instructorService = require('../services/instructor.service');

/**
 * GET /api/instructors
 * List all instructors with search, filter, and sort.
 */
const getAllInstructors = asyncHandler(async (req, res) => {
  const result = await instructorService.getAllInstructors(req.query);
  successResponse(res, 200, 'Instructors fetched successfully', result);
});

/**
 * GET /api/instructors/me
 * Get the authenticated instructor's own profile.
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const instructor = await instructorService.getMyInstructorProfile(req.user._id);
  successResponse(res, 200, 'Instructor profile fetched', { instructor });
});

/**
 * GET /api/instructors/dashboard
 * Get the instructor dashboard summary.
 */
const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await instructorService.getInstructorDashboard(req.user._id);
  successResponse(res, 200, 'Dashboard data fetched', dashboard);
});

/**
 * GET /api/instructors/:id
 * Get a public instructor profile by ID.
 */
const getInstructorById = asyncHandler(async (req, res) => {
  const instructor = await instructorService.getInstructorById(req.params.id);
  successResponse(res, 200, 'Instructor fetched successfully', { instructor });
});

/**
 * PUT /api/instructors/profile
 * Update the authenticated instructor's profile.
 */
const updateProfile = asyncHandler(async (req, res) => {
  const instructor = await instructorService.updateInstructorProfile(req.user._id, req.body);
  successResponse(res, 200, 'Profile updated successfully', { instructor });
});

/**
 * POST /api/instructors/payouts
 * Request an instructor payout withdrawal.
 */
const requestPayout = asyncHandler(async (req, res) => {
  const payout = await instructorService.requestPayout(req.user._id, req.body);
  successResponse(res, 201, 'Payout withdrawal request submitted successfully', { payout });
});

/**
 * GET /api/instructors/payouts
 * Get payout withdrawal history for the instructor.
 */
const getPayouts = asyncHandler(async (req, res) => {
  const payouts = await instructorService.getPayoutHistory(req.user._id);
  successResponse(res, 200, 'Payout history fetched successfully', { payouts });
});

/**
 * POST /api/instructors/courses/:id/submit-approval
 * Submit course for admin verification before publishing.
 */
const submitCourseApproval = asyncHandler(async (req, res) => {
  const course = await instructorService.submitCourseForApproval(req.user._id, req.params.id);
  successResponse(res, 200, 'Course submitted for admin approval', { course });
});

/**
 * PUT /api/instructors/admin/courses/:id/approve
 * Admin approves course for publication.
 */
const approveCourse = asyncHandler(async (req, res) => {
  const course = await instructorService.approveCourseAdmin(req.params.id, req.user._id);
  successResponse(res, 200, 'Course approved and published successfully', { course });
});

/**
 * PUT /api/instructors/admin/courses/:id/reject
 * Admin rejects course with remarks.
 */
const rejectCourse = asyncHandler(async (req, res) => {
  const course = await instructorService.rejectCourseAdmin(req.params.id, req.user._id, req.body.reason);
  successResponse(res, 200, 'Course rejected with feedback', { course });
});

module.exports = {
  getAllInstructors,
  getMyProfile,
  getDashboard,
  getInstructorById,
  updateProfile,
  requestPayout,
  getPayouts,
  submitCourseApproval,
  approveCourse,
  rejectCourse,
};
