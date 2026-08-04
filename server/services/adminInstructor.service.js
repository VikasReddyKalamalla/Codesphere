const Instructor = require('../models/Instructor');
const User = require('../models/User');
const InstructorApplication = require('../models/InstructorApplication');
const AdminLog = require('../models/AdminLog');
const notificationService = require('./notification.service');
const applicationService = require('./application.service');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get all instructors with optional search and status filter.
 */
const getAllInstructors = async (query = {}) => {
  const { page = 1, limit = 20, search, status } = query;

  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const pipeline = [
    { $match: filter },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
    { $unwind: '$userInfo' },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { 'userInfo.fullName': { $regex: search, $options: 'i' } },
          { 'userInfo.email': { $regex: search, $options: 'i' } },
          { expertise: { $regex: search, $options: 'i' } },
        ],
      },
    });
  }

  const countPipeline = [...pipeline, { $count: 'total' }];
  pipeline.push({ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: Number(limit) });

  const [instructors, countResult] = await Promise.all([
    Instructor.aggregate(pipeline),
    Instructor.aggregate(countPipeline),
  ]);

  return {
    instructors,
    pagination: {
      total: countResult[0]?.total || 0,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil((countResult[0]?.total || 0) / Number(limit)),
    },
  };
};

/**
 * Get all instructor applications with filters.
 */
const getAllApplications = async (query = {}) => {
  return applicationService.getAllApplications(query);
};

/**
 * Approve an instructor application (delegates to application service).
 */
const approveApplication = async (applicationId, adminId, remarks) => {
  return applicationService.reviewApplication(applicationId, adminId, {
    status: 'Approved',
    adminRemarks: remarks,
  });
};

/**
 * Reject an instructor application.
 */
const rejectApplication = async (applicationId, adminId, remarks) => {
  return applicationService.reviewApplication(applicationId, adminId, {
    status: 'Rejected',
    adminRemarks: remarks,
  });
};

/**
 * Suspend an instructor's profile.
 */
const suspendInstructor = async (instructorId, adminId, reason) => {
  const instructor = await Instructor.findByIdAndUpdate(
    instructorId,
    { status: 'Suspended', adminRemarks: reason },
    { new: true }
  );

  if (!instructor) throw createError('Instructor not found', 404);

  await notificationService.createNotification({
    recipient: instructor.user,
    title: 'Instructor Account Suspended',
    message: reason || 'Your instructor account has been suspended. Please contact support.',
    category: 'Admin',
    type: 'Warning',
    priority: 'Critical',
    icon: 'shield-off',
  });

  await AdminLog.create({
    admin: adminId,
    action: 'Instructor Suspended',
    module: 'Instructors',
    affectedUser: instructor.user,
    details: { reason },
  });

  return { message: 'Instructor suspended', instructor };
};

/**
 * Remove an instructor (revoke instructor role, keep account).
 */
const removeInstructor = async (instructorId, adminId) => {
  const instructor = await Instructor.findById(instructorId);
  if (!instructor) throw createError('Instructor not found', 404);

  // Downgrade user role back to student
  await User.findByIdAndUpdate(instructor.user, {
    role: 'student',
    isInstructor: false,
    applicationStatus: 'none',
  });

  await Instructor.findByIdAndDelete(instructorId);

  await notificationService.createNotification({
    recipient: instructor.user,
    title: 'Instructor Status Removed',
    message: 'Your instructor privileges have been removed by an administrator.',
    category: 'Admin',
    type: 'Warning',
    priority: 'High',
    icon: 'user-x',
  });

  await AdminLog.create({
    admin: adminId,
    action: 'Instructor Removed',
    module: 'Instructors',
    affectedUser: instructor.user,
  });

  return { message: 'Instructor removed and role downgraded to student' };
};

module.exports = {
  getAllInstructors,
  getAllApplications,
  approveApplication,
  rejectApplication,
  suspendInstructor,
  removeInstructor,
};
