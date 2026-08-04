const Progress     = require('../models/Progress');
const LearningPath = require('../models/LearningPath');
const Lesson       = require('../models/Lesson');
const Module       = require('../models/Module');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── MARK LESSON AS COMPLETE ──────────────────────────────────────────────────
const markLessonComplete = async (userId, lessonId, unmark) => {
  // 1. Find lesson and get its parent module and learning path
  const lesson = await Lesson.findById(lessonId).populate('moduleId');
  if (!lesson) throw createError('Lesson not found', 404);

  const moduleId       = lesson.moduleId._id;
  const learningPathId = lesson.moduleId.learningPathId;

  // 2. Find or create progress record
  let progress = await Progress.findOne({ userId, learningPathId });
  if (!progress) {
    progress = await Progress.create({ userId, learningPathId, completedLessons: [] });
  }

  // 3. Add or remove lesson from completed list
  if (unmark) {
    const idx = progress.completedLessons.indexOf(lessonId);
    if (idx > -1) {
      progress.completedLessons.splice(idx, 1);
    } else {
      return progress; // Already incomplete, no change
    }
  } else {
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    } else {
      return progress; // Already completed, no change
    }
  }

  // 4. Calculate completion percentage
  const totalLessonsCount = await Lesson.countDocuments({
    moduleId: { $in: (await Module.find({ learningPathId }).select('_id')) },
  });

  const completionPercentage = totalLessonsCount > 0
    ? Math.round((progress.completedLessons.length / totalLessonsCount) * 100)
    : 0;

  progress.completionPercentage = completionPercentage;

  // 5. Mark as fully completed if 100%
  if (completionPercentage === 100) {
    progress.isCompleted = true;
    progress.completedAt = new Date();
  } else {
    progress.isCompleted = false;
    progress.completedAt = null;
  }

  await progress.save();
  return progress;
};

// ─── GET PROGRESS FOR A USER & LEARNING PATH ──────────────────────────────────
const getProgress = async (userId, learningPathId) => {
  let progress = await Progress.findOne({ userId, learningPathId }).populate('completedLessons', 'title type');
  if (!progress) {
    progress = await Progress.create({ userId, learningPathId, completedLessons: [] });
  }
  return progress;
};

// ─── GET ALL PROGRESS FOR A USER ──────────────────────────────────────────────
const getAllProgress = async (userId) => {
  return Progress.find({ userId }).populate('learningPathId', 'title thumbnail category');
};

// ─── ENROLL ───────────────────────────────────────────────────────────────────
const enroll = async (userId, learningPathId) => {
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(String(learningPathId));
  if (isMongoId) {
    const path = await LearningPath.findById(learningPathId).catch(() => null);
    if (path) {
      await LearningPath.findByIdAndUpdate(learningPathId, { $inc: { totalStudents: 1 } }).catch(() => {});
    }
  }

  let progress = await Progress.findOne({ userId, learningPathId }).catch(() => null);
  if (progress) return progress; // already enrolled

  try {
    progress = await Progress.create({ userId, learningPathId, completedLessons: [] });
  } catch (err) {
    progress = { _id: `prog_${Date.now()}`, userId, learningPathId, completedLessons: [], completionPercentage: 0 };
  }

  return progress;
};

// ─── UNENROLL ─────────────────────────────────────────────────────────────────
const unenroll = async (userId, learningPathId) => {
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(String(learningPathId));
  const progress = await Progress.findOneAndDelete({ userId, learningPathId }).catch(() => null);
  if (progress && isMongoId) {
    await LearningPath.findByIdAndUpdate(learningPathId, { $inc: { totalStudents: -1 } }).catch(() => {});
  }
  return { message: 'Unenrolled' };
};

module.exports = { markLessonComplete, getProgress, getAllProgress, enroll, unenroll };
