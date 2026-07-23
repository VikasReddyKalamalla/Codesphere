const SessionQuiz = require('../models/SessionQuiz');
const QuizAttempt = require('../models/QuizAttempt');
const LiveSession = require('../models/LiveSession');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getQuizzes = async (sessionId, userId) => {
  const quizzes = await SessionQuiz.find({ sessionId }).sort({ createdAt: -1 });

  // For each quiz, fetch if the current user attempted it
  const results = await Promise.all(
    quizzes.map(async (q) => {
      const attempt = await QuizAttempt.findOne({ quizId: q._id, userId });
      const allAttempts = await QuizAttempt.find({ quizId: q._id })
        .populate('userId', 'fullName avatar')
        .sort({ score: -1, updatedAt: 1 })
        .lean();

      return {
        ...q.toObject(),
        attempt,
        leaderboard: allAttempts,
      };
    })
  );

  return results;
};

const createQuiz = async (sessionId, creatorId, body) => {
  const { title, questions } = body;
  if (!title) throw createError('Quiz title is required', 400);
  if (!questions || questions.length === 0) throw createError('At least 1 question is required', 400);

  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== creatorId.toString()) {
    throw createError('Only the host can create quizzes', 403);
  }

  return SessionQuiz.create({
    sessionId,
    creatorId,
    title,
    questions,
    status: 'draft',
    activeQuestionIndex: 0,
  });
};

const startQuiz = async (quizId, userId) => {
  const quiz = await SessionQuiz.findById(quizId);
  if (!quiz) throw createError('Quiz not found', 404);

  const session = await LiveSession.findById(quiz.sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can start quizzes', 403);
  }

  quiz.status = 'active';
  await quiz.save();

  return quiz;
};

const submitQuizAttempt = async (quizId, userId, answersInput) => {
  const quiz = await SessionQuiz.findById(quizId);
  if (!quiz) throw createError('Quiz not found', 404);
  if (quiz.status !== 'active') throw createError('Quiz is not active', 400);

  // Check if user already attempted
  const existing = await QuizAttempt.findOne({ quizId, userId });
  if (existing) throw createError('You already attempted this quiz', 400);

  let score = 0;
  const processedAnswers = quiz.questions.map((q, idx) => {
    const input = answersInput.find((a) => a.questionIndex === idx);
    const selectedOptionIndex = input ? input.selectedOptionIndex : -1;
    const isCorrect = selectedOptionIndex === q.correctOptionIndex;

    if (isCorrect) score += 1;

    return {
      questionIndex: idx,
      selectedOptionIndex,
      isCorrect,
    };
  });

  const attempt = await QuizAttempt.create({
    quizId,
    userId,
    score,
    answers: processedAnswers,
  });

  return attempt;
};

module.exports = {
  getQuizzes,
  createQuiz,
  startQuiz,
  submitQuizAttempt,
};
