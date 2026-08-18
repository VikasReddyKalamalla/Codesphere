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
const markLessonComplete = async (userId, lessonId, unmark, pathId) => {
  if (!userId) throw createError('User ID is required', 400);
  if (!lessonId) throw createError('Lesson ID is required', 400);

  let learningPathId = null;
  let lesson = null;

  const isMongoLessonId = /^[0-9a-fA-F]{24}$/.test(String(lessonId));
  if (isMongoLessonId) {
    lesson = await Lesson.findById(lessonId).populate('moduleId').catch(() => null);
  }

  if (lesson && lesson.moduleId && lesson.moduleId.learningPathId) {
    learningPathId = lesson.moduleId.learningPathId;
  } else {
    // Determine target LearningPath from pathId or lessonId prefix
    let targetPath = null;
    const rawPathId = pathId || (typeof lessonId === 'string' && lessonId.includes('-l-') ? lessonId.split('-l-')[0] : null);

    if (rawPathId) {
      const isMongoPathId = /^[0-9a-fA-F]{24}$/.test(String(rawPathId));
      if (isMongoPathId) {
        targetPath = await LearningPath.findById(rawPathId).catch(() => null);
      }
      if (!targetPath) {
        const term = String(rawPathId).replace(/-/g, '.*');
        targetPath = await LearningPath.findOne({
          $or: [
            { title: { $regex: new RegExp(term, 'i') } },
            { category: { $regex: new RegExp(term, 'i') } }
          ]
        }).catch(() => null);
      }
    }

    if (!targetPath) {
      targetPath = await LearningPath.findOne().catch(() => null);
    }

    if (targetPath) {
      learningPathId = targetPath._id;
    }
  }

  if (!learningPathId) {
    throw createError('Learning path not found for this lesson', 404);
  }

  // 2. Find or create progress record
  let progress = await Progress.findOne({ userId, learningPathId }).catch(() => null);
  if (!progress) {
    progress = await Progress.create({ userId, learningPathId, completedLessons: [], completionPercentage: 0 });
  }

  const lessonIdStr = String(lessonId);
  const completedList = Array.isArray(progress.completedLessons) ? progress.completedLessons.map(String) : [];
  const existingIndex = completedList.indexOf(lessonIdStr);

  // 3. Add or remove lesson from completed list
  if (unmark) {
    if (existingIndex > -1) {
      progress.completedLessons.splice(existingIndex, 1);
    } else {
      return progress;
    }
  } else {
    if (existingIndex === -1) {
      progress.completedLessons.push(lessonIdStr);
      // Record user activity for streak
      try {
        const { recordUserActivity } = require('./activity.service');
        recordUserActivity(userId, {
          module: 'Learning',
          action: 'completed_lesson',
          referenceId: lessonIdStr,
          referenceType: 'Lesson',
        }).catch(() => {});
      } catch (aErr) {}
    } else {
      return progress;
    }
  }

  // 4. Calculate total lessons for this path
  let totalLessonsCount = await Lesson.countDocuments({
    moduleId: { $in: (await Module.find({ learningPathId }).select('_id')) },
  }).catch(() => 0);

  if (totalLessonsCount === 0) {
    totalLessonsCount = Math.max(12, progress.completedLessons.length);
  }

  const completionPercentage = totalLessonsCount > 0
    ? Math.min(100, Math.round((progress.completedLessons.length / totalLessonsCount) * 100))
    : 0;

  progress.completionPercentage = completionPercentage;

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
  if (!userId || !learningPathId) return null;

  const isMongoId = /^[0-9a-fA-F]{24}$/.test(String(learningPathId));
  let targetPathId = null;

  if (isMongoId) {
    targetPathId = learningPathId;
  } else {
    const term = String(learningPathId).replace(/-/g, '.*');
    const path = await LearningPath.findOne({
      $or: [
        { title: { $regex: new RegExp(term, 'i') } },
        { category: { $regex: new RegExp(term, 'i') } }
      ]
    }).catch(() => null);
    if (path) targetPathId = path._id;
  }

  if (!targetPathId) {
    const fallbackPath = await LearningPath.findOne().catch(() => null);
    if (fallbackPath) targetPathId = fallbackPath._id;
  }

  if (!targetPathId) return null;

  let progress = await Progress.findOne({ userId, learningPathId: targetPathId }).populate('completedLessons', 'title type').catch(() => null);
  if (!progress) {
    progress = await Progress.create({ userId, learningPathId: targetPathId, completedLessons: [] }).catch(() => null);
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
