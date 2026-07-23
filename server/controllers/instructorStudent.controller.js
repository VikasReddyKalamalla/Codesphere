const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const instructorStudentService = require('../services/instructorStudent.service');

/**
 * GET /api/instructor-students
 * Get all students under the authenticated instructor.
 */
const getStudents = asyncHandler(async (req, res) => {
  const result = await instructorStudentService.getInstructorStudents(req.user._id, req.query);
  successResponse(res, 200, 'Students fetched successfully', result);
});

/**
 * GET /api/instructor-students/:id
 * Get detailed progress data for a specific student.
 */
const getStudentDetail = asyncHandler(async (req, res) => {
  const record = await instructorStudentService.getStudentDetail(req.user._id, req.params.id);
  successResponse(res, 200, 'Student details fetched', { student: record });
});

module.exports = {
  getStudents,
  getStudentDetail,
};
