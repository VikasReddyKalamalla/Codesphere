const Instructor = require('../models/Instructor');
const InstructorAnalytics = require('../models/InstructorAnalytics');
const InstructorStudent = require('../models/InstructorStudent');
const LearningPath = require('../models/LearningPath');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get monthly analytics records for the authenticated instructor.
 * Returns up to 12 months of history.
 */
const getAnalytics = async (userId, query = {}) => {
  const { months = 12 } = query;

  const instructor = await Instructor.findOne({ user: userId });
  if (!instructor) throw createError('Instructor profile not found', 404);

  const records = await InstructorAnalytics.find({ instructor: instructor._id })
    .sort({ period: -1 })
    .limit(Number(months));

  return { analytics: records, instructorId: instructor._id };
};

/**
 * Generate or refresh the current-month analytics snapshot for the instructor.
 * This is a REST-driven snapshot — background workers will eventually automate this.
 */
const generateCurrentMonthAnalytics = async (userId) => {
  const instructor = await Instructor.findOne({ user: userId });
  if (!instructor) throw createError('Instructor profile not found', 404);

  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Student metrics
  const studentAgg = await InstructorStudent.aggregate([
    { $match: { instructor: instructor._id } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: ['$isActive', 1, 0] } },
        newThisMonth: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gte: ['$enrolledAt', startOfMonth] },
                  { $lte: ['$enrolledAt', endOfMonth] },
                ],
              },
              1,
              0,
            ],
          },
        },
        avgProgress: { $avg: '$overallProgress' },
        avgScore: { $avg: '$averageScore' },
      },
    },
  ]);

  const sData = studentAgg[0] || {};

  // Course completion rates
  const courseData = await LearningPath.aggregate([
    { $match: { createdBy: instructor.user } },
    {
      $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        published: { $sum: { $cond: ['$isPublished', 1, 0] } },
      },
    },
  ]);

  const cData = courseData[0] || {};

  const snapshot = {
    instructor: instructor._id,
    period,
    newStudents: sData.newThisMonth || 0,
    activeStudents: sData.active || 0,
    courseEnrollments: instructor.totalStudents,
    averageCourseProgress: Math.round(sData.avgProgress || 0),
    averageAssessmentScore: Math.round(sData.avgScore || 0),
    sessionsHosted: instructor.totalLiveSessions,
    eventsOrganized: instructor.totalEvents,
    averageRating: instructor.rating,
  };

  // Upsert this month's record
  const record = await InstructorAnalytics.findOneAndUpdate(
    { instructor: instructor._id, period },
    snapshot,
    { upsert: true, new: true }
  );

  return record;
};

/**
 * Get aggregate statistics (all-time) for the authenticated instructor.
 */
const getInstructorStatistics = async (userId) => {
  const instructor = await Instructor.findOne({ user: userId }).populate(
    'user',
    'fullName username createdAt'
  );

  if (!instructor) throw createError('Instructor profile not found', 404);

  const [studentStats, allTimeAnalytics] = await Promise.all([
    InstructorStudent.aggregate([
      { $match: { instructor: instructor._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          avgProgress: { $avg: '$overallProgress' },
          avgScore: { $avg: '$averageScore' },
          avgSandboxes: { $avg: '$completedSandboxes' },
          avgSessions: { $avg: '$attendedSessions' },
        },
      },
    ]),
    InstructorAnalytics.aggregate([
      { $match: { instructor: instructor._id } },
      {
        $group: {
          _id: null,
          totalNewStudents: { $sum: '$newStudents' },
          totalEnrollments: { $sum: '$courseEnrollments' },
          totalSessionAttendees: { $sum: '$totalSessionAttendees' },
          totalEventAttendees: { $sum: '$eventAttendees' },
          avgRating: { $avg: '$averageRating' },
        },
      },
    ]),
  ]);

  const s = studentStats[0] || {};
  const a = allTimeAnalytics[0] || {};

  return {
    instructor: {
      _id: instructor._id,
      user: instructor.user,
      rating: instructor.rating,
      totalRatings: instructor.totalRatings,
      status: instructor.status,
    },
    totals: {
      students: instructor.totalStudents,
      activeStudents: s.active || 0,
      courses: instructor.totalCourses,
      sandboxProjects: instructor.totalSandboxProjects,
      liveSessions: instructor.totalLiveSessions,
      events: instructor.totalEvents,
      tests: instructor.totalTests,
      certificatesIssued: instructor.totalCertificatesIssued,
    },
    averages: {
      studentProgress: Math.round(s.avgProgress || 0),
      studentScore: Math.round(s.avgScore || 0),
      rating: Number(instructor.rating.toFixed(2)),
    },
    allTimeEnrollments: a.totalEnrollments || instructor.totalStudents,
  };
};

module.exports = {
  getAnalytics,
  generateCurrentMonthAnalytics,
  getInstructorStatistics,
};
