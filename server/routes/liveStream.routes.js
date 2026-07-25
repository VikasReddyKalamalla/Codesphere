const express = require('express');
const router = express.Router();

const {
  getAgoraToken,
  createLiveKitRoom,
  startSessionRecording,
  stopSessionRecording,
  getStreamStats,
} = require('../controllers/liveStream.controller');

const { protect } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(protect);

// Agora endpoints
router.post('/agora/token', getAgoraToken);

// LiveKit endpoints
router.post('/livekit/room', createLiveKitRoom);
router.get('/stats/:roomName', getStreamStats);

// Recording endpoints
router.post('/recording/start', startSessionRecording);
router.post('/recording/stop', stopSessionRecording);

module.exports = router;
