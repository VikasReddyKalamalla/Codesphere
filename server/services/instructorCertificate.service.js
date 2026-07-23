const Instructor = require('../models/Instructor');
const InstructorCertificate = require('../models/InstructorCertificate');
const User = require('../models/User');
const notificationService = require('./notification.service');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get all certificates issued by the authenticated instructor.
 * Supports filtering by referenceType, student, status.
 */
const getIssuedCertificates = async (userId, query = {}) => {
  const { page = 1, limit = 20, referenceType, status, studentId, search } = query;

  const instructor = await Instructor.findOne({ user: userId });
  if (!instructor) throw createError('Instructor profile not found', 404);

  const filter = { instructor: instructor._id };
  if (referenceType) filter.referenceType = referenceType;
  if (status) filter.status = status;
  if (studentId) filter.student = studentId;

  const skip = (Number(page) - 1) * Number(limit);

  const pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: 'users',
        localField: 'student',
        foreignField: '_id',
        as: 'studentInfo',
      },
    },
    { $unwind: '$studentInfo' },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { 'studentInfo.fullName': { $regex: search, $options: 'i' } },
          { 'studentInfo.email': { $regex: search, $options: 'i' } },
          { referenceTitle: { $regex: search, $options: 'i' } },
          { certificateNumber: { $regex: search, $options: 'i' } },
        ],
      },
    });
  }

  const countPipeline = [...pipeline, { $count: 'total' }];

  pipeline.push(
    { $sort: { issuedAt: -1 } },
    { $skip: skip },
    { $limit: Number(limit) }
  );

  const [certificates, countResult] = await Promise.all([
    InstructorCertificate.aggregate(pipeline),
    InstructorCertificate.aggregate(countPipeline),
  ]);

  const total = countResult[0]?.total || 0;

  return {
    certificates,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Issue a certificate to a student.
 * Prevents duplicate certificates for the same student + reference.
 */
const issueCertificate = async (userId, data) => {
  const { studentId, referenceType, referenceId, referenceTitle, grade, score, certificateUrl } = data;

  const instructor = await Instructor.findOne({ user: userId });
  if (!instructor) throw createError('Instructor profile not found', 404);

  // Validate student exists
  const student = await User.findById(studentId);
  if (!student) throw createError('Student not found', 404);

  // Check for duplicate
  const existing = await InstructorCertificate.findOne({
    instructor: instructor._id,
    student: studentId,
    referenceId,
    status: 'Active',
  });

  if (existing) {
    throw createError('Certificate already issued for this student and course', 409);
  }

  const certificate = await InstructorCertificate.create({
    instructor: instructor._id,
    student: studentId,
    referenceType,
    referenceId,
    referenceTitle,
    grade,
    score,
    certificateUrl,
  });

  // Increment instructor certificate count
  await Instructor.findByIdAndUpdate(instructor._id, {
    $inc: { totalCertificatesIssued: 1 },
  });

  // Notify the student
  await notificationService.createNotification({
    recipient: studentId,
    title: 'Certificate Issued!',
    message: `You have received a certificate for completing "${referenceTitle}".`,
    category: 'Instructor',
    type: 'Success',
    priority: 'High',
    icon: 'award',
    referenceId: certificate._id,
    referenceModule: 'Certificate',
  });

  return certificate;
};

/**
 * Revoke a certificate (sets status to Revoked).
 */
const revokeCertificate = async (userId, certificateId, revokeReason) => {
  const instructor = await Instructor.findOne({ user: userId });
  if (!instructor) throw createError('Instructor profile not found', 404);

  const certificate = await InstructorCertificate.findOne({
    _id: certificateId,
    instructor: instructor._id,
  });

  if (!certificate) throw createError('Certificate not found', 404);
  if (certificate.status === 'Revoked') {
    throw createError('Certificate is already revoked', 400);
  }

  certificate.status = 'Revoked';
  certificate.revokedAt = new Date();
  certificate.revokeReason = revokeReason || 'Certificate revoked by instructor';
  await certificate.save();

  // Decrement instructor certificate count
  await Instructor.findByIdAndUpdate(instructor._id, {
    $inc: { totalCertificatesIssued: -1 },
  });

  // Notify the student
  await notificationService.createNotification({
    recipient: certificate.student,
    title: 'Certificate Revoked',
    message: revokeReason || `Your certificate for "${certificate.referenceTitle}" has been revoked.`,
    category: 'Instructor',
    type: 'Warning',
    priority: 'High',
    icon: 'x-circle',
  });

  return { message: 'Certificate revoked successfully', certificate };
};

/**
 * Verify a certificate by its certificate number (public endpoint).
 */
const verifyCertificate = async (certificateNumber) => {
  const certificate = await InstructorCertificate.findOne({ certificateNumber })
    .populate('instructor', 'user expertise')
    .populate('student', 'fullName username');

  if (!certificate) throw createError('Certificate not found', 404);

  return {
    valid: certificate.status === 'Active',
    certificate,
  };
};

module.exports = {
  getIssuedCertificates,
  issueCertificate,
  revokeCertificate,
  verifyCertificate,
};
