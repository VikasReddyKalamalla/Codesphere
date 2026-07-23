const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const recordingService      = require('../services/recording.service');

// POST /api/sessions/:id/recording
const addRecording = asyncHandler(async (req, res) => {
  const data = await recordingService.addRecording(req.params.id, req.user._id, req.body);
  return successResponse(res, 201, 'Recording added successfully', data);
});

// GET /api/sessions/:id/recordings
const getRecordings = asyncHandler(async (req, res) => {
  const data = await recordingService.getRecordings(req.params.id, req.user._id);
  return successResponse(res, 200, 'Recordings fetched successfully', data);
});

// DELETE /api/recordings/:id
const deleteRecording = asyncHandler(async (req, res) => {
  const data = await recordingService.deleteRecording(req.params.id, req.user._id);
  return successResponse(res, 200, 'Recording deleted successfully', data);
});

module.exports = { addRecording, getRecordings, deleteRecording };
