const SessionQuestion = require('../models/SessionQuestion');
const SessionAnswer = require('../models/SessionAnswer');
const LiveSession = require('../models/LiveSession');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getQuestions = async (sessionId) => {
  const questions = await SessionQuestion.find({ sessionId })
    .populate('userId', 'fullName avatar')
    .sort({ isPinned: -1, createdAt: -1 });

  // For each question, find its answers
  const results = await Promise.all(
    questions.map(async (q) => {
      const answers = await SessionAnswer.find({ questionId: q._id })
        .populate('userId', 'fullName avatar')
        .sort({ createdAt: 1 });
      return {
        ...q.toObject(),
        answers,
      };
    })
  );

  return results;
};

const askQuestion = async (sessionId, userId, questionText) => {
  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  const question = await SessionQuestion.create({
    sessionId,
    userId,
    questionText,
    votes: [],
  });

  return question.populate('userId', 'fullName avatar');
};

const postAnswer = async (questionId, userId, answerText) => {
  const question = await SessionQuestion.findById(questionId);
  if (!question) throw createError('Question not found', 404);

  const answer = await SessionAnswer.create({
    questionId,
    userId,
    answerText,
  });

  // Automatically mark the question as answered if the host/instructor answers it
  const session = await LiveSession.findById(question.sessionId);
  if (session && session.host.toString() === userId.toString()) {
    question.isAnswered = true;
    await question.save();
  }

  return answer.populate('userId', 'fullName avatar');
};

const voteQuestion = async (questionId, userId) => {
  const question = await SessionQuestion.findById(questionId);
  if (!question) throw createError('Question not found', 404);

  const hasVoted = question.votes.includes(userId);
  if (hasVoted) {
    question.votes.pull(userId);
  } else {
    question.votes.push(userId);
  }

  await question.save();
  return question.populate('userId', 'fullName avatar');
};

const pinQuestion = async (questionId, userId) => {
  const question = await SessionQuestion.findById(questionId);
  if (!question) throw createError('Question not found', 404);

  const session = await LiveSession.findById(question.sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can pin questions', 403);
  }

  question.isPinned = !question.isPinned;
  await question.save();

  return question.populate('userId', 'fullName avatar');
};

const markAnswered = async (questionId, userId) => {
  const question = await SessionQuestion.findById(questionId);
  if (!question) throw createError('Question not found', 404);

  const session = await LiveSession.findById(question.sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can modify answered status', 403);
  }

  question.isAnswered = !question.isAnswered;
  await question.save();

  return question.populate('userId', 'fullName avatar');
};

module.exports = {
  getQuestions,
  askQuestion,
  postAnswer,
  voteQuestion,
  pinQuestion,
  markAnswered,
};
