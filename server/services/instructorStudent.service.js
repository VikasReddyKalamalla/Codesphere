const Instructor = require('../models/Instructor');
const InstructorStudent = require('../models/InstructorStudent');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get all students for the authenticated instructor.
 * Supports search, isActive filter, and pagination.
 */
const getInstructorStudents = async (userId, query = {}) => {
  const { page = 1, limit = 20, search, isActive } = query;

  const instructor = await Instructor.findOne({ user: userId });
  if (!instructor) throw createError('Instructor profile not found', 404);

  const filter = { instructor: instructor._id };
  if (typeof isActive !== 'undefined') filter.isActive = isActive === 'true';

  const skip = (Number(page) - 1) * Number(limit);

  // Use aggregation to enable name search via user lookup
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
          { 'studentInfo.username': { $regex: search, $options: 'i' } },
          { 'studentInfo.email': { $regex: search, $options: 'i' } },
        ],
      },
    });
  }

  const countPipeline = [...pipeline, { $count: 'total' }];

  pipeline.push(
    { $sort: { enrolledAt: -1 } },
    { $skip: skip },
    { $limit: Number(limit) },
    {
      $project: {
        student: 1,
        learningPath: 1,
        overallProgress: 1,
        completedLessons: 1,
        completedAssessments: 1,
        averageScore: 1,
        attendedSessions: 1,
        completedSandboxes: 1,
        lastActiveAt: 1,
        enrolledAt: 1,
        isActive: 1,
        'studentInfo.fullName': 1,
        'studentInfo.username': 1,
        'studentInfo.email': 1,
        'studentInfo.avatar': 1,
        'studentInfo.plan': 1,
      },
    }
  );

  const [students, countResult] = await Promise.all([
    InstructorStudent.aggregate(pipeline),
    InstructorStudent.aggregate(countPipeline),
  ]);

  const total = countResult[0]?.total || 0;

  return {
    students,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get detailed progress data for a single student.
 */
const getStudentDetail = async (userId, studentId) => {
  const instructor = await Instructor.findOne({ user: userId });
  if (!instructor) throw createError('Instructor profile not found', 404);

  const record = await InstructorStudent.findOne({
    instructor: instructor._id,
    student: studentId,
  })
    .populate('student', 'fullName username email avatar plan dayStreak achievementPoints')
    .populate('learningPath', 'title category difficulty');

  if (!record) throw createError('Student not found in your roster', 404);

  return record;
};

module.exports = {
  getInstructorStudents,
  getStudentDetail,
};
