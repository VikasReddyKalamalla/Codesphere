const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const attendanceService     = require('../services/attendance.service');

// POST /api/sessions/:id/check-in
const checkIn = asyncHandler(async (req, res) => {
  const data = await attendanceService.checkIn(req.params.id, req.user._id);
  return successResponse(res, 200, 'Checked in successfully', data);
});

// POST /api/sessions/:id/check-out
const checkOut = asyncHandler(async (req, res) => {
  const data = await attendanceService.checkOut(req.params.id, req.user._id);
  return successResponse(res, 200, 'Checked out successfully', data);
});

// GET /api/sessions/:id/attendance
const getAttendance = asyncHandler(async (req, res) => {
  const data = await attendanceService.getAttendance(req.params.id, req.user._id);
  return successResponse(res, 200, 'Attendance fetched successfully', data);
});

module.exports = { checkIn, checkOut, getAttendance };
