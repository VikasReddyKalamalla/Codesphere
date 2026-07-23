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

module.exports = {
  getAllInstructors,
  getMyProfile,
  getDashboard,
  getInstructorById,
  updateProfile,
};
