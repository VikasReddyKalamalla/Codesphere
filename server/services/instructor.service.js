const Instructor = require('../models/Instructor');
const InstructorApplication = require('../models/InstructorApplication');
const User = require('../models/User');
const LearningPath = require('../models/LearningPath');
const InstructorStudent = require('../models/InstructorStudent');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── PUBLIC LISTING ───────────────────────────────────────────────────────────

/**
 * Get all active instructors with optional search, filter, and sort.
 */
const getAllInstructors = async (query = {}) => {
  const {
    page = 1,
    limit = 20,
    search,
    skill,
    specialization,
    sort = 'newest',
  } = query;

  const filter = { status: 'Active' };

  if (skill) filter.skills = { $in: [new RegExp(skill, 'i')] };
  if (specialization) filter.specialization = { $in: [new RegExp(specialization, 'i')] };

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    'highest-rated': { rating: -1 },
    'most-students': { totalStudents: -1 },
    popular: { totalStudents: -1, rating: -1 },
  };
  const sortOrder = sortMap[sort] || sortMap.newest;

  const skip = (Number(page) - 1) * Number(limit);

  // Build aggregation to join User fullName / username for search
  const matchStage = { $match: filter };
  const lookupStage = {
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'userInfo',
    },
  };
  const unwindStage = { $unwind: '$userInfo' };

  const pipeline = [matchStage, lookupStage, unwindStage];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { 'userInfo.fullName': { $regex: search, $options: 'i' } },
          { 'userInfo.username': { $regex: search, $options: 'i' } },
          { expertise: { $regex: search, $options: 'i' } },
          { skills: { $in: [new RegExp(search, 'i')] } },
        ],
      },
    });
  }

  const countPipeline = [...pipeline, { $count: 'total' }];

  pipeline.push(
    { $sort: sortOrder },
    { $skip: skip },
    { $limit: Number(limit) },
    {
      $project: {
        user: 1,
        bio: 1,
        expertise: 1,
        skills: 1,
        specialization: 1,
        rating: 1,
        totalStudents: 1,
        totalCourses: 1,
        totalLiveSessions: 1,
        totalSandboxProjects: 1,
        status: 1,
        createdAt: 1,
        'userInfo.fullName': 1,
        'userInfo.username': 1,
        'userInfo.avatar': 1,
      },
    }
  );

  const [instructors, countResult] = await Promise.all([
    Instructor.aggregate(pipeline),
    Instructor.aggregate(countPipeline),
  ]);

  const total = countResult[0]?.total || 0;

  return {
    instructors,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get a single instructor's public profile by instructorId.
 */
const getInstructorById = async (instructorId) => {
  const instructor = await Instructor.findById(instructorId)
    .populate('user', 'fullName username email avatar bio plan')
    .populate('approvedBy', 'fullName');

  if (!instructor) throw createError('Instructor not found', 404);
  return instructor;
};

/**
 * Get the authenticated user's instructor profile.
 */
const getMyInstructorProfile = async (userId) => {
  const instructor = await Instructor.findOne({ user: userId }).populate(
    'user',
    'fullName username email avatar bio plan'
  );

  if (!instructor) throw createError('Instructor profile not found', 404);
  return instructor;
};

/**
 * Update an instructor's own profile fields.
 */
const updateInstructorProfile = async (userId, data) => {
  // Strip fields that should not be directly updated by the instructor
  const { status, approvedBy, approvedAt, adminRemarks, totalStudents, totalCourses, ...updateData } = data;

  const instructor = await Instructor.findOneAndUpdate(
    { user: userId, status: 'Active' },
    updateData,
    { new: true, runValidators: true }
  ).populate('user', 'fullName username email avatar bio');

  if (!instructor) throw createError('Active instructor profile not found', 404);
  return instructor;
};

// ─── INSTRUCTOR DASHBOARD ─────────────────────────────────────────────────────

/**
 * Build dashboard summary for the authenticated instructor.
 */
const getInstructorDashboard = async (userId) => {
  const instructor = await Instructor.findOne({ user: userId });
  if (!instructor) throw createError('Instructor profile not found', 404);

  // Course (learning path) stats
  const courses = await LearningPath.find({
    createdBy: userId,
    isPublished: true,
  }).select('title totalStudents rating createdAt');

  // Student stats
  const studentStats = await InstructorStudent.aggregate([
    { $match: { instructor: instructor._id } },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: 1 },
        activeStudents: { $sum: { $cond: ['$isActive', 1, 0] } },
        avgProgress: { $avg: '$overallProgress' },
        avgScore: { $avg: '$averageScore' },
      },
    },
  ]);

  const sStats = studentStats[0] || {};

  return {
    instructor: {
      _id: instructor._id,
      rating: instructor.rating,
      totalStudents: instructor.totalStudents,
      totalCourses: instructor.totalCourses,
      totalSandboxProjects: instructor.totalSandboxProjects,
      totalLiveSessions: instructor.totalLiveSessions,
      totalEvents: instructor.totalEvents,
      totalTests: instructor.totalTests,
      totalCertificatesIssued: instructor.totalCertificatesIssued,
      status: instructor.status,
    },
    courses,
    studentStats: {
      total: sStats.totalStudents || 0,
      active: sStats.activeStudents || 0,
      averageProgress: Math.round(sStats.avgProgress || 0),
      averageScore: Math.round(sStats.avgScore || 0),
    },
  };
};

// ─── INSTRUCTOR PAYOUT & REVENUE SPLIT SYSTEM ──────────────────────────────────
const InstructorPayout = require('../models/InstructorPayout');

/**
 * Request an instructor payout withdrawal with 70% revenue split calculation.
 */
const requestPayout = async (userId, data) => {
  const instructor = await Instructor.findOne({ user: userId, status: 'Active' });
  if (!instructor) throw createError('Active instructor profile not found', 404);

  const { grossEarnings, payoutMethod, paymentDetails } = data;
  if (!grossEarnings || grossEarnings <= 0) throw createError('Gross earnings must be greater than 0', 400);

  const revenueSharePercentage = 70; // 70% revenue share to creator
  const netPayout = Math.round((grossEarnings * revenueSharePercentage) / 100 * 100) / 100;

  const payout = await InstructorPayout.create({
    instructor: instructor._id,
    user: userId,
    grossEarnings,
    revenueSharePercentage,
    netPayout,
    payoutMethod: payoutMethod || 'Bank_Transfer',
    paymentDetails: paymentDetails || {},
    status: 'Pending',
  });

  return payout;
};

/**
 * Get payout history for an instructor.
 */
const getPayoutHistory = async (userId) => {
  const instructor = await Instructor.findOne({ user: userId });
  if (!instructor) throw createError('Instructor profile not found', 404);

  const payouts = await InstructorPayout.find({ instructor: instructor._id }).sort({ createdAt: -1 });
  return payouts;
};

// ─── COURSE APPROVAL WORKFLOW ──────────────────────────────────────────────────

/**
 * Instructor submits course for admin verification.
 */
const submitCourseForApproval = async (userId, courseId) => {
  const course = await LearningPath.findOne({ _id: courseId, createdBy: userId });
  if (!course) throw createError('Course not found or unauthorized', 404);

  course.approvalStatus = 'Pending_Approval';
  course.submittedForApprovalAt = new Date();
  await course.save();

  return course;
};

/**
 * Admin approves course for publication.
 */
const approveCourseAdmin = async (courseId, adminId) => {
  const course = await LearningPath.findById(courseId);
  if (!course) throw createError('Course not found', 404);

  course.approvalStatus = 'Approved';
  course.isPublished = true;
  course.approvedBy = adminId;
  course.approvedAt = new Date();
  course.rejectionReason = undefined;
  await course.save();

  return course;
};

/**
 * Admin rejects course with remarks.
 */
const rejectCourseAdmin = async (courseId, adminId, reason) => {
  const course = await LearningPath.findById(courseId);
  if (!course) throw createError('Course not found', 404);

  course.approvalStatus = 'Rejected';
  course.isPublished = false;
  course.rejectionReason = reason || 'Course does not meet platform quality guidelines.';
  await course.save();

  return course;
};

module.exports = {
  getAllInstructors,
  getInstructorById,
  getMyInstructorProfile,
  updateInstructorProfile,
  getInstructorDashboard,
  requestPayout,
  getPayoutHistory,
  submitCourseForApproval,
  approveCourseAdmin,
  rejectCourseAdmin,
};
