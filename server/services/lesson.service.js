const Lesson = require('../models/Lesson');
const Module = require('../models/Module');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET LESSONS BY MODULE ────────────────────────────────────────────────────
const getLessonsByModule = async (moduleId) => {
  const mod = await Module.findById(moduleId);
  if (!mod) throw createError('Module not found', 404);

  return Lesson.find({ moduleId }).sort({ order: 1 });
};

// ─── GET LESSON BY ID ─────────────────────────────────────────────────────────
const getLessonById = async (id) => {
  const lesson = await Lesson.findById(id).populate('moduleId', 'title learningPathId');
  if (!lesson) throw createError('Lesson not found', 404);
  return lesson;
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
const createLesson = async (body) => {
  const { moduleId, title, type, order } = body;
  if (!moduleId) throw createError('moduleId is required', 400);
  if (!title)    throw createError('Title is required', 400);
  if (!type)     throw createError('Type is required', 400);
  if (!order)    throw createError('Order is required', 400);

  // Verify parent module exists
  const mod = await Module.findById(moduleId);
  if (!mod) throw createError('Module not found', 404);

  const lesson = await Lesson.create(body);

  // Push lesson reference into Module
  await Module.findByIdAndUpdate(moduleId, {
    $push: { lessons: lesson._id },
    $inc:  { duration: lesson.duration || 0 },
  });

  return lesson;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const updateLesson = async (id, body) => {
  const lesson = await Lesson.findById(id);
  if (!lesson) throw createError('Lesson not found', 404);

  // Prevent re-assigning parent module
  delete body.moduleId;

  return Lesson.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
const deleteLesson = async (id) => {
  const lesson = await Lesson.findById(id);
  if (!lesson) throw createError('Lesson not found', 404);

  // Remove lesson reference from Module and subtract duration
  await Module.findByIdAndUpdate(lesson.moduleId, {
    $pull: { lessons: lesson._id },
    $inc:  { duration: -(lesson.duration || 0) },
  });

  await lesson.deleteOne();
};

module.exports = { getLessonsByModule, getLessonById, createLesson, updateLesson, deleteLesson };
