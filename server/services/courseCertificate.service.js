/**
 * Course Completion PDF Certificate Service
 * Auto-generates official CodeSphere Completion Certificates upon 100% progress.
 */

const crypto = require('crypto');
const logger = require('../utils/logger');
const LearningPath = require('../models/LearningPath');
const User = require('../models/User');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Generate PDF completion certificate details upon 100% course progress
 */
const generateCourseCertificate = async (userId, courseId) => {
  const user = await User.findById(userId);
  if (!user) throw createError('User not found', 404);

  const course = await LearningPath.findById(courseId);
  if (!course) throw createError('Course not found', 404);

  // Generate unique certificate verification hash
  const certificateId = `CERT-CS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const verificationUrl = `https://codesphere.dev/verify-certificate/${certificateId}`;

  const certificateData = {
    certificateId,
    candidateName: user.fullName,
    courseTitle: course.title,
    category: course.category,
    issuedAt: new Date(),
    verificationUrl,
    pdfDownloadUrl: `/api/learning/certificates/${certificateId}/download`,
    issuer: 'CodeSphere Verified Learning Platform',
  };

  logger.info(`Generated completion certificate [${certificateId}] for user ${user.fullName} on course: ${course.title}`);

  return certificateData;
};

module.exports = {
  generateCourseCertificate,
};
