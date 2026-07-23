const InstructorApplication = require('../models/InstructorApplication');
const Instructor = require('../models/Instructor');
const User = require('../models/User');
const notificationService = require('./notification.service');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Submit a new instructor application.
 * Only one Pending application per user is allowed.
 */
const submitApplication = async (userId, data) => {
  // Check if user already is an instructor
  const user = await User.findById(userId);
  if (user.role === 'instructor' || user.isInstructor) {
    throw createError('You are already an instructor', 400);
  }

  // Check if there is a Pending application
  const pending = await InstructorApplication.findOne({
    applicant: userId,
    status: 'Pending',
  });

  if (pending) {
    throw createError('You already have a pending application', 409);
  }

  const application = await InstructorApplication.create({
    applicant: userId,
    ...data,
  });

  // Send notification to the user confirming submission
  await notificationService.createNotification({
    recipient: userId,
    title: 'Instructor Application Submitted',
    message: 'Your instructor application has been submitted and is under review.',
    category: 'Instructor',
    type: 'Information',
    priority: 'Medium',
    icon: 'file-text',
  });

  return application;
};

/**
 * Get the authenticated user's own application(s).
 */
const getMyApplication = async (userId) => {
  const application = await InstructorApplication.findOne({ applicant: userId }).sort({
    createdAt: -1,
  });

  if (!application) throw createError('No application found', 404);
  return application;
};

/**
 * Update an existing application (only if still Pending).
 */
const updateApplication = async (applicationId, userId, data) => {
  const application = await InstructorApplication.findOne({
    _id: applicationId,
    applicant: userId,
  });

  if (!application) throw createError('Application not found', 404);
  if (application.status !== 'Pending') {
    throw createError('Only pending applications can be updated', 400);
  }

  Object.assign(application, data);
  await application.save();

  return application;
};

/**
 * Cancel a pending application (soft delete by changing status).
 */
const cancelApplication = async (applicationId, userId) => {
  const application = await InstructorApplication.findOne({
    _id: applicationId,
    applicant: userId,
  });

  if (!application) throw createError('Application not found', 404);
  if (application.status !== 'Pending') {
    throw createError('Only pending applications can be cancelled', 400);
  }

  application.status = 'Cancelled';
  await application.save();

  return { message: 'Application cancelled successfully' };
};

// ─── ADMIN OPERATIONS ─────────────────────────────────────────────────────────

/**
 * Get all applications with filtering (admin only).
 */
const getAllApplications = async (query = {}) => {
  const { page = 1, limit = 20, status, search } = query;

  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: 'users',
        localField: 'applicant',
        foreignField: '_id',
        as: 'applicantInfo',
      },
    },
    { $unwind: '$applicantInfo' },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { 'applicantInfo.fullName': { $regex: search, $options: 'i' } },
          { 'applicantInfo.email': { $regex: search, $options: 'i' } },
          { expertiseArea: { $regex: search, $options: 'i' } },
        ],
      },
    });
  }

  const countPipeline = [...pipeline, { $count: 'total' }];

  pipeline.push(
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: Number(limit) }
  );

  const [applications, countResult] = await Promise.all([
    InstructorApplication.aggregate(pipeline),
    InstructorApplication.aggregate(countPipeline),
  ]);

  const total = countResult[0]?.total || 0;

  return {
    applications,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Review (approve/reject) an application (admin only).
 * If approved, create an Instructor document and upgrade user role.
 */
const reviewApplication = async (applicationId, adminId, data) => {
  const { status, adminRemarks } = data;

  if (!['Approved', 'Rejected'].includes(status)) {
    throw createError('Invalid status. Must be Approved or Rejected', 400);
  }

  const application = await InstructorApplication.findById(applicationId);
  if (!application) throw createError('Application not found', 404);
  if (application.status !== 'Pending') {
    throw createError('Application has already been reviewed', 400);
  }

  application.status = status;
  application.adminRemarks = adminRemarks || '';
  application.reviewedBy = adminId;
  application.reviewedAt = new Date();
  await application.save();

  const user = await User.findById(application.applicant);

  if (status === 'Approved') {
    // Create Instructor document
    const instructor = await Instructor.create({
      user: application.applicant,
      bio: application.professionalBio,
      expertise: application.expertiseArea,
      yearsOfExperience: application.yearsOfExperience,
      skills: application.skills,
      portfolioUrl: application.portfolioUrl,
      githubUrl: application.githubUrl,
      linkedinUrl: application.linkedinUrl,
      status: 'Active',
      approvedBy: adminId,
      approvedAt: new Date(),
    });

    // Upgrade user role
    user.role = 'instructor';
    user.isInstructor = true;
    user.applicationStatus = 'approved';
    await user.save();

    // Send approval notification
    await notificationService.createNotification({
      recipient: user._id,
      title: 'Instructor Application Approved!',
      message: 'Congratulations! Your instructor application has been approved. You can now create courses.',
      category: 'Instructor',
      type: 'Success',
      priority: 'Critical',
      icon: 'shield-check',
    });
  } else {
    // Rejected
    user.applicationStatus = 'rejected';
    await user.save();

    // Send rejection notification
    await notificationService.createNotification({
      recipient: user._id,
      title: 'Instructor Application Rejected',
      message: adminRemarks || 'Unfortunately, your instructor application was not approved at this time.',
      category: 'Instructor',
      type: 'Information',
      priority: 'High',
      icon: 'x-circle',
    });
  }

  return application.populate('applicant', 'fullName email');
};

module.exports = {
  submitApplication,
  getMyApplication,
  updateApplication,
  cancelApplication,
  getAllApplications,
  reviewApplication,
};
