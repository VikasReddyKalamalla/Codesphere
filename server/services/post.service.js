const Post      = require('../models/Post');
const Community = require('../models/Community');
const Comment   = require('../models/Comment');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ALL POSTS (by community) ─────────────────────────────────────────────
const getPostsByCommunity = async (communityId, { page = 1, limit = 10 }) => {
  const community = await Community.findById(communityId);
  if (!community) throw createError('Community not found', 404);

  const total = await Post.countDocuments({ communityId, isArchived: false });
  const { skip, ...meta } = getPagination(page, limit, total);

  const posts = await Post.find({ communityId, isArchived: false })
    .populate('author', 'fullName avatar')
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, posts };
};

// ─── GET POST BY ID ───────────────────────────────────────────────────────────
const getPostById = async (id) => {
  const post = await Post.findById(id)
    .populate('author', 'fullName avatar bio')
    .populate({ path: 'comments', options: { limit: 5, sort: { createdAt: -1 } } });

  if (!post) throw createError('Post not found', 404);

  // Increment views
  post.views += 1;
  await post.save();

  return post;
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
const createPost = async (body, userId) => {
  const { communityId, content } = body;

  if (!communityId) throw createError('Community ID is required', 400);
  if (!content)     throw createError('Content is required', 400);

  const community = await Community.findById(communityId);
  if (!community) throw createError('Community not found', 404);

  // Check if user is a member
  if (!community.members.includes(userId)) {
    throw createError('You must be a member to post', 403);
  }

  const post = await Post.create({ ...body, author: userId });

  // Update community post count
  await Community.findByIdAndUpdate(communityId, {
    $push: { posts: post._id },
    $inc:  { postCount: 1 },
  });

  return post;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const updatePost = async (id, body, userId) => {
  const post = await Post.findById(id);
  if (!post) throw createError('Post not found', 404);

  if (post.author.toString() !== userId.toString()) {
    throw createError('You can only update your own posts', 403);
  }

  // Prevent changing author/community
  delete body.author;
  delete body.communityId;

  return Post.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
const deletePost = async (id, userId, userRole) => {
  const post = await Post.findById(id).populate('communityId', 'owner moderators');
  if (!post) throw createError('Post not found', 404);

  const isAuthor    = post.author.toString() === userId.toString();
  const isOwner     = post.communityId.owner.toString() === userId.toString();
  const isModerator = post.communityId.moderators.some((m) => m.toString() === userId.toString());

  if (!isAuthor && !isOwner && !isModerator && userRole !== 'admin') {
    throw createError('You are not authorized to delete this post', 403);
  }

  // Remove from community posts array and decrement count
  await Community.findByIdAndUpdate(post.communityId, {
    $pull: { posts: post._id },
    $inc:  { postCount: -1 },
  });

  // Delete all comments on this post
  await Comment.deleteMany({ postId: id });

  await post.deleteOne();
};

// ─── LIKE / UNLIKE ────────────────────────────────────────────────────────────
const toggleLike = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw createError('Post not found', 404);

  const liked = post.likes.includes(userId);

  if (liked) {
    post.likes.pull(userId);
    post.likeCount = post.likes.length;
  } else {
    post.likes.push(userId);
    post.likeCount = post.likes.length;
  }

  await post.save();
  return { liked: !liked, likeCount: post.likeCount };
};

// ─── BOOKMARK / UNBOOKMARK ────────────────────────────────────────────────────
const toggleBookmark = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw createError('Post not found', 404);

  const bookmarked = post.bookmarks.includes(userId);

  if (bookmarked) {
    post.bookmarks.pull(userId);
    post.bookmarkCount = post.bookmarks.length;
  } else {
    post.bookmarks.push(userId);
    post.bookmarkCount = post.bookmarks.length;
  }

  await post.save();
  return { bookmarked: !bookmarked, bookmarkCount: post.bookmarkCount };
};

// ─── PIN / UNPIN ──────────────────────────────────────────────────────────────
const togglePin = async (postId, userId) => {
  const post = await Post.findById(postId).populate('communityId', 'owner moderators');
  if (!post) throw createError('Post not found', 404);

  const isOwner     = post.communityId.owner.toString() === userId.toString();
  const isModerator = post.communityId.moderators.some((m) => m.toString() === userId.toString());

  if (!isOwner && !isModerator) {
    throw createError('Only owner/moderators can pin posts', 403);
  }

  post.isPinned = !post.isPinned;
  await post.save();

  // Sync with community pinnedPosts
  if (post.isPinned) {
    await Community.findByIdAndUpdate(post.communityId, { $addToSet: { pinnedPosts: postId } });
  } else {
    await Community.findByIdAndUpdate(post.communityId, { $pull: { pinnedPosts: postId } });
  }

  return { isPinned: post.isPinned };
};

module.exports = {
  getPostsByCommunity,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark,
  togglePin,
};
