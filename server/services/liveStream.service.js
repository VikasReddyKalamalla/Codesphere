/**
 * Live Streaming Service
 * Integrates with Agora or LiveKit for video streaming
 */

const axios = require('axios');
const logger = require('../utils/logger');

const AGORA_APP_ID = process.env.AGORA_APP_ID;
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
const LIVEKT_API_URL = process.env.LIVEKT_API_URL;
const LIVEKT_API_KEY = process.env.LIVEKT_API_KEY;

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Generate Agora RTC token for user
 */
const generateAgoraToken = (channelName, userId) => {
  if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
    logger.warn('Agora credentials not configured, returning mock token');
    return {
      token: `mock_token_${Date.now()}`,
      channelName,
      userId,
      expiration: Date.now() + 3600000,
    };
  }

  try {
    // In production, use agora-access-token npm package
    // For now, return mock token
    return {
      token: `agora_token_${AGORA_APP_ID}_${channelName}_${userId}`,
      channelName,
      userId,
      expiration: Date.now() + 3600000,
    };
  } catch (error) {
    logger.error(`Agora token generation error: ${error.message}`);
    throw createError('Failed to generate video token', 500);
  }
};

/**
 * Create LiveKit room
 */
const createLiveKitRoom = async (roomName, maxParticipants = 100) => {
  if (!LIVEKT_API_URL || !LIVEKT_API_KEY) {
    logger.warn('LiveKit credentials not configured, returning mock room');
    return {
      name: roomName,
      emptyTimeout: 300,
      maxParticipants,
      createdAt: Date.now(),
    };
  }

  try {
    const response = await axios.post(
      `${LIVEKT_API_URL}/api/rooms`,
      {
        name: roomName,
        emptyTimeout: 300,
        maxParticipants,
      },
      {
        headers: {
          Authorization: `Bearer ${LIVEKT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error(`LiveKit room creation error: ${error.message}`);
    throw createError('Failed to create video room', 500);
  }
};

/**
 * Generate LiveKit access token
 */
const generateLiveKitToken = async (roomName, userId, userName) => {
  if (!LIVEKT_API_URL || !LIVEKT_API_KEY) {
    return {
      token: `mock_livekit_token_${Date.now()}`,
      url: 'ws://localhost:7880',
      roomName,
      userId,
    };
  }

  try {
    const response = await axios.post(
      `${LIVEKT_API_URL}/api/access_tokens`,
      {
        roomName,
        participantName: userName,
        participantIdentity: userId,
        grants: {
          roomJoin: true,
          room: roomName,
          canPublish: true,
          canPublishData: true,
          canSubscribe: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${LIVEKT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      token: response.data.token,
      url: LIVEKT_API_URL,
      roomName,
      userId,
    };
  } catch (error) {
    logger.error(`LiveKit token generation error: ${error.message}`);
    throw createError('Failed to generate video token', 500);
  }
};

/**
 * Start recording session
 */
const startRecording = async (sessionId, roomName) => {
  try {
    // In production, implement actual recording start
    return {
      recordingId: `rec_${sessionId}_${Date.now()}`,
      sessionId,
      roomName,
      status: 'recording',
      startedAt: new Date(),
    };
  } catch (error) {
    logger.error(`Recording start error: ${error.message}`);
    throw createError('Failed to start recording', 500);
  }
};

/**
 * Stop recording session
 */
const stopRecording = async (recordingId) => {
  try {
    return {
      recordingId,
      status: 'stopped',
      stoppedAt: new Date(),
      duration: Math.random() * 3600000, // Mock duration
    };
  } catch (error) {
    logger.error(`Recording stop error: ${error.message}`);
    throw createError('Failed to stop recording', 500);
  }
};

/**
 * Get streaming statistics
 */
const getStreamStats = async (roomName) => {
  try {
    if (!LIVEKT_API_URL || !LIVEKT_API_KEY) {
      return {
        roomName,
        participants: 0,
        activeStreams: 0,
        bandwidth: 0,
        latency: 0,
      };
    }

    const response = await axios.get(
      `${LIVEKT_API_URL}/api/rooms/${roomName}`,
      {
        headers: {
          Authorization: `Bearer ${LIVEKT_API_KEY}`,
        },
      }
    );

    return {
      roomName,
      participants: response.data.numParticipants,
      activeStreams: response.data.numParticipants,
      createdAt: response.data.createdAt,
    };
  } catch (error) {
    logger.error(`Stream stats error: ${error.message}`);
    return { roomName, error: 'Unable to fetch stats' };
  }
};

module.exports = {
  generateAgoraToken,
  createLiveKitRoom,
  generateLiveKitToken,
  startRecording,
  stopRecording,
  getStreamStats,
};
