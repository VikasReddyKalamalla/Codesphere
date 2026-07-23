const Question = require('../models/Question');
const Test     = require('../models/Test');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── ASSERT INSTRUCTOR ACCESS ─────────────────────────────────────────────────
const assertInstructor = async (testId, userId, userRole) => {
  const test = await Test.findById(testId);
  if (!test) throw createError('Test not found', 404);
  if (test.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('Only the test instructor can manage questions', 403);
  }
  return test;
};

// ─── GET QUESTIONS FOR TEST ───────────────────────────────────────────────────
const getTestQuestions = async (testId, userId, includeAnswers = false) => {
  const test = await Test.findById(testId);
  if (!test) throw createError('Test not found', 404);

  const selectFields = includeAnswers ? '' : '-correctAnswer -explanation';

  return Question.find({ testId }).select(selectFields).sort({ orderIndex: 1 });
};

// ─── GET QUESTION BY ID ───────────────────────────────────────────────────────
const getQuestionById = async (questionId) => {
  const question = await Question.findById(questionId);
  if (!question) throw createError('Question not found', 404);
  return question;
};

// ─── CREATE QUESTION ──────────────────────────────────────────────────────────
const createQuestion = async (body, userId, userRole) => {
  const { testId, questionTitle } = body;

  if (!testId)        throw createError('Test ID is required', 400);
  if (!questionTitle) throw createError('Question title is required', 400);

  const test = await assertInstructor(testId, userId, userRole);

  const question = await Question.create(body);

  // Update test stats
  await Test.findByIdAndUpdate(testId, {
    $inc: { totalQuestions: 1, totalMarks: question.marks || 0 },
  });

  return question;
};

// ─── UPDATE QUESTION ──────────────────────────────────────────────────────────
const updateQuestion = async (questionId, body, userId, userRole) => {
  const question = await Question.findById(questionId);
  if (!question) throw createError('Question not found', 404);

  await assertInstructor(question.testId, userId, userRole);

  const oldMarks = question.marks || 0;
  const newMarks = body.marks !== undefined ? body.marks : oldMarks;
  const marksDiff = newMarks - oldMarks;

  const updated = await Question.findByIdAndUpdate(questionId, body, { new: true, runValidators: true });

  if (marksDiff !== 0) {
    await Test.findByIdAndUpdate(question.testId, { $inc: { totalMarks: marksDiff } });
  }

  return updated;
};

// ─── DELETE QUESTION ──────────────────────────────────────────────────────────
const deleteQuestion = async (questionId, userId, userRole) => {
  const question = await Question.findById(questionId);
  if (!question) throw createError('Question not found', 404);

  await assertInstructor(question.testId, userId, userRole);

  await Test.findByIdAndUpdate(question.testId, {
    $inc: { totalQuestions: -1, totalMarks: -(question.marks || 0) },
  });

  await question.deleteOne();
};

module.exports = { getTestQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion };
