const Comment = require('../models/Comment');
const Post    = require('../models/Post');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET COMMENTS BY POST ─────────────────────────────────────────────────────
const getCommentsByPost = async (postId, { page = 1, limit = 20 }) => {
  const post = await Post.findById(postId);
  if (!post) throw createError('Post not found', 404);

  const filter = { postId, parentComment: null }; // top-level only
  const total  = await Comment.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  const comments = await Comment.find(filter)
    .populate('author', 'fullName avatar')
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(meta.limit);

  // Attach replies for each comment
  const commentsWithReplies = await Promise.all(
    comments.map(async (c) => {
      const replies = await Comment.find({ parentComment: c._id })
        .populate('author', 'fullName avatar')
        .sort({ createdAt: 1 });
      return { ...c.toObject(), replies };
    })
  );

  return { ...meta, comments: commentsWithReplies };
};

// ─── ADD COMMENT ──────────────────────────────────────────────────────────────
const addComment = async (body, userId) => {
  const { postId, content, parentComment } = body;

  if (!postId)  throw createError('Post ID is required', 400);
  if (!content) throw createError('Content is required', 400);

  const post = await Post.findById(postId);
  if (!post) throw createError('Post not found', 404);

  // If replying to a comment, verify parent exists
  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (!parent) throw createError('Parent comment not found', 404);
  }

  const comment = await Comment.create({ postId, author: userId, content, parentComment: parentComment || null });

  // Push comment ref + increment comment count on post
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
    $inc:  { commentCount: 1 },
  });

  return comment.populate('author', 'fullName avatar');
};

// ─── UPDATE COMMENT ───────────────────────────────────────────────────────────
const updateComment = async (id, content, userId) => {
  const comment = await Comment.findById(id);
  if (!comment) throw createError('Comment not found', 404);

  if (comment.author.toString() !== userId.toString()) {
    throw createError('You can only edit your own comments', 403);
  }

  comment.content  = content;
  comment.isEdited = true;
  await comment.save();

  return comment;
};

// ─── DELETE COMMENT ───────────────────────────────────────────────────────────
const deleteComment = async (id, userId, userRole) => {
  const comment = await Comment.findById(id);
  if (!comment) throw createError('Comment not found', 404);

  const isAuthor = comment.author.toString() === userId.toString();
  if (!isAuthor && userRole !== 'admin') {
    throw createError('You can only delete your own comments', 403);
  }

  // Remove from post
  await Post.findByIdAndUpdate(comment.postId, {
    $pull: { comments: comment._id },
    $inc:  { commentCount: -1 },
  });

  // Delete replies too
  await Comment.deleteMany({ parentComment: id });

  await comment.deleteOne();
};

// ─── TOGGLE LIKE ON COMMENT ───────────────────────────────────────────────────
const toggleCommentLike = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw createError('Comment not found', 404);

  const liked = comment.likes.includes(userId);

  if (liked) {
    comment.likes.pull(userId);
  } else {
    comment.likes.push(userId);
  }

  comment.likeCount = comment.likes.length;
  await comment.save();

  return { liked: !liked, likeCount: comment.likeCount };
};

module.exports = {
  getCommentsByPost,
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
};
