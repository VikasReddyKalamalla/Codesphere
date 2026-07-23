const SessionRecording = require('../models/SessionRecording');
const LiveSession      = require('../models/LiveSession');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── ADD RECORDING ────────────────────────────────────────────────────────────
const addRecording = async (sessionId, userId, body) => {
  const { recordingUrl, title, duration, fileSizeMB, isPublic } = body;

  if (!recordingUrl) throw createError('Recording URL is required', 400);

  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can add recordings', 403);
  }

  const recording = await SessionRecording.create({
    sessionId,
    uploadedBy: userId,
    recordingUrl,
    title:      title || session.title,
    duration:   duration || 0,
    fileSizeMB: fileSizeMB || 0,
    isPublic:   isPublic || false,
  });

  // Store first recording link on session doc for quick access
  if (!session.recordingLink) {
    await LiveSession.findByIdAndUpdate(sessionId, { recordingLink: recordingUrl });
  }

  return recording;
};

// ─── GET RECORDINGS ───────────────────────────────────────────────────────────
const getRecordings = async (sessionId, userId) => {
  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  // Host sees all; others see only public recordings
  const isHost = session.host.toString() === userId.toString();
  const filter = isHost ? { sessionId } : { sessionId, isPublic: true };

  const recordings = await SessionRecording.find(filter)
    .populate('uploadedBy', 'fullName')
    .sort({ uploadedAt: -1 });

  return recordings;
};

// ─── DELETE RECORDING ─────────────────────────────────────────────────────────
const deleteRecording = async (recordingId, userId) => {
  const recording = await SessionRecording.findById(recordingId);
  if (!recording) throw createError('Recording not found', 404);

  if (recording.uploadedBy.toString() !== userId.toString()) {
    throw createError('Only the uploader can delete this recording', 403);
  }

  await recording.deleteOne();
  return { message: 'Recording deleted successfully' };
};

module.exports = { addRecording, getRecordings, deleteRecording };
