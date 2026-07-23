const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const instructorCourseService = require('../services/instructorCourse.service');

/**
 * GET /api/instructor-courses
 * Get courses created by the authenticated instructor with enrollment stats.
 */
const getInstructorCourses = asyncHandler(async (req, res) => {
  const result = await instructorCourseService.getInstructorCourses(req.user._id, req.query);
  successResponse(res, 200, 'Courses fetched successfully', result);
});

/**
 * GET /api/instructor-courses/:id/stats
 * Get detailed stats for a specific course.
 */
const getCourseStats = asyncHandler(async (req, res) => {
  const result = await instructorCourseService.getCourseStats(req.user._id, req.params.id);
  successResponse(res, 200, 'Course stats fetched', result);
});

module.exports = {
  getInstructorCourses,
  getCourseStats,
};
