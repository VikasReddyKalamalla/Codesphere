const Instructor = require('../models/Instructor');
const InstructorCourse = require('../models/InstructorCourse');
const LearningPath = require('../models/LearningPath');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get all courses (learning paths) created by the instructor,
 * joined with aggregated stats from InstructorCourse.
 */
const getInstructorCourses = async (userId, query = {}) => {
  const { page = 1, limit = 20, search, isPublished } = query;

  const instructor = await Instructor.findOne({ user: userId });
  if (!instructor) throw createError('Instructor profile not found', 404);

  const filter = { createdBy: userId };
  if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);

  const [courses, total] = await Promise.all([
    LearningPath.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    LearningPath.countDocuments(filter),
  ]);

  // Enrich with InstructorCourse stats
  const courseIds = courses.map((c) => c._id);
  const stats = await InstructorCourse.find({
    instructor: instructor._id,
    learningPath: { $in: courseIds },
  }).lean();

  const statsMap = stats.reduce((acc, s) => {
    acc[s.learningPath.toString()] = s;
    return acc;
  }, {});

  const enriched = courses.map((c) => ({
    ...c,
    stats: statsMap[c._id.toString()] || {
      totalEnrollments: 0,
      completions: 0,
      averageProgress: 0,
      averageRating: 0,
    },
  }));

  return {
    courses: enriched,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get stats for a single course.
 */
const getCourseStats = async (userId, courseId) => {
  const instructor = await Instructor.findOne({ user: userId });
  if (!instructor) throw createError('Instructor profile not found', 404);

  const course = await LearningPath.findOne({ _id: courseId, createdBy: userId });
  if (!course) throw createError('Course not found', 404);

  const stats = await InstructorCourse.findOne({
    instructor: instructor._id,
    learningPath: courseId,
  });

  return { course, stats };
};

module.exports = {
  getInstructorCourses,
  getCourseStats,
};
