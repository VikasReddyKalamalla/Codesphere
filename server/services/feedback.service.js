const SessionFeedback = require('../models/SessionFeedback');
const LiveSession     = require('../models/LiveSession');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── SUBMIT FEEDBACK ──────────────────────────────────────────────────────────
const submitFeedback = async (sessionId, userId, body) => {
  const { rating, review, suggestions, issueReport } = body;

  if (!rating) throw createError('Rating is required', 400);

  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.status !== 'completed') {
    throw createError('Feedback can only be submitted after the session is completed', 400);
  }

  // Check if already submitted
  const existing = await SessionFeedback.findOne({ sessionId, userId });
  if (existing) throw createError('You have already submitted feedback', 409);

  const feedback = await SessionFeedback.create({ sessionId, userId, rating, review, suggestions, issueReport });

  // Update session average rating
  const allFeedbacks = await SessionFeedback.find({ sessionId });
  const avgRating    = allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / allFeedbacks.length;

  await LiveSession.findByIdAndUpdate(sessionId, {
    averageRating: parseFloat(avgRating.toFixed(1)),
    totalFeedback: allFeedbacks.length,
  });

  return feedback;
};

// ─── GET FEEDBACK (for host) ──────────────────────────────────────────────────
const getFeedback = async (sessionId, userId) => {
  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can view feedback', 403);
  }

  const feedbacks = await SessionFeedback.find({ sessionId })
    .populate('userId', 'fullName avatar')
    .sort({ createdAt: -1 });

  const summary = {
    totalFeedback:  feedbacks.length,
    averageRating:  session.averageRating,
    ratingBreakdown: {
      5: feedbacks.filter((f) => f.rating === 5).length,
      4: feedbacks.filter((f) => f.rating === 4).length,
      3: feedbacks.filter((f) => f.rating === 3).length,
      2: feedbacks.filter((f) => f.rating === 2).length,
      1: feedbacks.filter((f) => f.rating === 1).length,
    },
  };

  return { summary, feedbacks };
};

module.exports = { submitFeedback, getFeedback };
