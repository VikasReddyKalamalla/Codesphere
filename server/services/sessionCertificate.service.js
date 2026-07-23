const SessionCertificate = require('../models/SessionCertificate');
const SessionAttendance = require('../models/SessionAttendance');
const LiveSession = require('../models/LiveSession');
const crypto = require('crypto');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getCertificates = async (userId) => {
  return SessionCertificate.find({ userId })
    .populate('sessionId', 'title startTime endTime host')
    .sort({ createdAt: -1 });
};

const generateCertificate = async (sessionId, userId) => {
  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);
  if (session.status !== 'completed') {
    throw createError('Certificates can only be generated for completed sessions', 400);
  }

  // Verify attendance
  const attendance = await SessionAttendance.findOne({ sessionId, userId });
  if (!attendance || !attendance.isCompleted) {
    throw createError('You must attend at least 80% of the session to receive a certificate', 400);
  }

  // Check if already generated
  const existing = await SessionCertificate.findOne({ sessionId, userId });
  if (existing) return existing;

  const verificationCode = crypto.randomBytes(8).toString('hex').toUpperCase();
  const certificateUrl = `/uploads/certificates/cert-${sessionId}-${userId}.pdf`;

  return SessionCertificate.create({
    sessionId,
    userId,
    certificateUrl,
    type: 'completion',
    verificationCode,
  });
};

module.exports = {
  getCertificates,
  generateCertificate,
};
