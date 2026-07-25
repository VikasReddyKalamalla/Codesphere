const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const liveStreamService = require('../services/liveStream.service');
const Session = require('../models/Session');
const logger = require('../utils/logger');

/**
 * Get Agora token for video streaming
 */
const getAgoraToken = asyncHandler(async (req, res) => {
  const { channelName } = req.body;
  const userId = req.user._id;

  if (!channelName) {
    return errorResponse(res, 400, 'Channel name is required');
  }

  const token = liveStreamService.generateAgoraToken(channelName, userId.toString());
  logger.info(`Agora token generated for user ${userId}`);

  return successResponse(res, 200, 'Agora token generated', token);
});

/**
 * Create LiveKit room and get token
 */
const createLiveKitRoom = asyncHandler(async (req, res) => {
  const { roomName, maxParticipants = 100 } = req.body;
  const userId = req.user._id;

  if (!roomName) {
    return errorResponse(res, 400, 'Room name is required');
  }

  // Create room in LiveKit
  const room = await liveStreamService.createLiveKitRoom(roomName, maxParticipants);

  // Generate access token
  const tokenData = await liveStreamService.generateLiveKitToken(
    roomName,
    userId.toString(),
    req.user.fullName
  );

  logger.info(`LiveKit room created: ${roomName}`);

  return successResponse(res, 201, 'LiveKit room created', {
    room,
    token: tokenData,
  });
});

/**
 * Start session recording
 */
const startSessionRecording = asyncHandler(async (req, res) => {
  const { sessionId, roomName } = req.body;
  const userId = req.user._id;

  if (!sessionId || !roomName) {
    return errorResponse(res, 400, 'Session ID and room name required');
  }

  // Verify user is instructor
  const session = await Session.findById(sessionId);
  if (!session || session.instructor.toString() !== userId.toString()) {
    return errorResponse(res, 403, 'Unauthorized to start recording');
  }

  const recordingData = await liveStreamService.startRecording(sessionId, roomName);

  // Update session with recording ID
  await Session.findByIdAndUpdate(sessionId, {
    recordingId: recordingData.recordingId,
    isRecording: true,
  });

  logger.info(`Recording started for session ${sessionId}`);

  return successResponse(res, 200, 'Recording started', recordingData);
});

/**
 * Stop session recording
 */
const stopSessionRecording = asyncHandler(async (req, res) => {
  const { sessionId, recordingId } = req.body;
  const userId = req.user._id;

  if (!sessionId || !recordingId) {
    return errorResponse(res, 400, 'Session ID and recording ID required');
  }

  const session = await Session.findById(sessionId);
  if (!session || session.instructor.toString() !== userId.toString()) {
    return errorResponse(res, 403, 'Unauthorized');
  }

  const stoppedRecording = await liveStreamService.stopRecording(recordingId);

  // Update session
  await Session.findByIdAndUpdate(sessionId, {
    isRecording: false,
    recordingUrl: `https://cdn.codesphere.dev/recordings/${recordingId}.mp4`,
  });

  logger.info(`Recording stopped for session ${sessionId}`);

  return successResponse(res, 200, 'Recording stopped', stoppedRecording);
});

/**
 * Get stream statistics
 */
const getStreamStats = asyncHandler(async (req, res) => {
  const { roomName } = req.params;

  if (!roomName) {
    return errorResponse(res, 400, 'Room name required');
  }

  const stats = await liveStreamService.getStreamStats(roomName);

  return successResponse(res, 200, 'Stream stats retrieved', stats);
});

module.exports = {
  getAgoraToken,
  createLiveKitRoom,
  startSessionRecording,
  stopSessionRecording,
  getStreamStats,
};
