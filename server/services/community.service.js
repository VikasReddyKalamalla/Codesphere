const Community = require('../models/Community');
const Post      = require('../models/Post');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ALL (with search & filters) ──────────────────────────────────────────
const getAllCommunities = async (query) => {
  const {
    page = 1,
    limit = 12,
    category,
    visibility,
    search,
    sortBy = 'createdAt',
    order = 'desc',
  } = query;

  const filter = { status: 'active' };

  if (category)    filter.category   = category;
  if (visibility)  filter.visibility = visibility;
  if (search)      filter.$text = { $search: search };

  const total = await Community.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  const sortOrder = order === 'desc' ? -1 : 1;
  const sortOptions = {};

  if (sortBy === 'members') sortOptions.memberCount = sortOrder;
  else if (sortBy === 'posts') sortOptions.postCount = sortOrder;
  else sortOptions.createdAt = sortOrder;

  const communities = await Community.find(filter)
    .populate('owner', 'fullName avatar')
    .sort(sortOptions)
    .skip(skip)
    .limit(meta.limit)
    .select('-members -posts'); // don't populate full arrays for list view

  return { ...meta, communities };
};

// ─── GET BY ID ────────────────────────────────────────────────────────────────
const getCommunityById = async (id) => {
  const community = await Community.findById(id)
    .populate('owner',      'fullName avatar bio')
    .populate('moderators', 'fullName avatar')
    .populate({ path: 'members', select: 'fullName avatar', options: { limit: 20 } });

  if (!community) throw createError('Community not found', 404);

  // Increment view count
  community.viewCount += 1;
  await community.save();

  return community;
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
const createCommunity = async (body, userId) => {
  const { name } = body;
  if (!name) throw createError('Community name is required', 400);

  const existing = await Community.findOne({ name: name.trim() });
  if (existing) throw createError('Community name already exists', 409);

  return Community.create({
    ...body,
    owner:       userId,
    members:     [userId],
    memberCount: 1,
  });
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const updateCommunity = async (id, body, userId, userRole) => {
  const community = await Community.findById(id);
  if (!community) throw createError('Community not found', 404);

  // Only owner, moderators, or admin can update
  const isModerator = community.moderators.some((m) => m.toString() === userId.toString());
  const isOwner     = community.owner.toString() === userId.toString();

  if (!isOwner && !isModerator && userRole !== 'admin') {
    throw createError('You are not authorized to update this community', 403);
  }

  // Prevent changing owner
  delete body.owner;

  return Community.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
const deleteCommunity = async (id, userId, userRole) => {
  const community = await Community.findById(id);
  if (!community) throw createError('Community not found', 404);

  if (community.owner.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('Only the owner or admin can delete this community', 403);
  }

  // Cascade delete all posts
  await Post.deleteMany({ communityId: id });
  await community.deleteOne();
};

// ─── JOIN ─────────────────────────────────────────────────────────────────────
const joinCommunity = async (communityId, userId) => {
  const community = await Community.findById(communityId);
  if (!community) throw createError('Community not found', 404);

  if (community.members.includes(userId)) {
    throw createError('You are already a member', 409);
  }

  community.members.push(userId);
  community.memberCount = community.members.length;
  await community.save();

  return { message: 'Joined community successfully', memberCount: community.memberCount };
};

// ─── LEAVE ────────────────────────────────────────────────────────────────────
const leaveCommunity = async (communityId, userId) => {
  const community = await Community.findById(communityId);
  if (!community) throw createError('Community not found', 404);

  if (community.owner.toString() === userId.toString()) {
    throw createError('Owner cannot leave the community. Transfer ownership first.', 400);
  }

  if (!community.members.includes(userId)) {
    throw createError('You are not a member', 400);
  }

  community.members.pull(userId);
  community.memberCount = community.members.length;
  await community.save();

  return { message: 'Left community successfully', memberCount: community.memberCount };
};

// ─── GET MEMBERS ──────────────────────────────────────────────────────────────
const getMembers = async (communityId, { page = 1, limit = 20 }) => {
  const community = await Community.findById(communityId);
  if (!community) throw createError('Community not found', 404);

  const total = community.members.length;
  const { skip, ...meta } = getPagination(page, limit, total);

  const members = await Community.findById(communityId)
    .select('members')
    .populate({
      path:    'members',
      select:  'fullName avatar bio',
      options: { skip, limit: meta.limit },
    });

  return { ...meta, members: members.members };
};

// ─── PROMOTE MODERATOR ────────────────────────────────────────────────────────
const promoteModerator = async (communityId, targetUserId, userId) => {
  const community = await Community.findById(communityId);
  if (!community) throw createError('Community not found', 404);

  if (community.owner.toString() !== userId.toString()) {
    throw createError('Only the owner can promote moderators', 403);
  }

  if (community.moderators.includes(targetUserId)) {
    throw createError('User is already a moderator', 409);
  }

  community.moderators.push(targetUserId);
  await community.save();

  return { message: 'User promoted to moderator successfully' };
};

// ─── REMOVE MODERATOR ─────────────────────────────────────────────────────────
const removeModerator = async (communityId, targetUserId, userId) => {
  const community = await Community.findById(communityId);
  if (!community) throw createError('Community not found', 404);

  if (community.owner.toString() !== userId.toString()) {
    throw createError('Only the owner can remove moderators', 403);
  }

  community.moderators.pull(targetUserId);
  await community.save();

  return { message: 'Moderator removed successfully' };
};

module.exports = {
  getAllCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  getMembers,
  promoteModerator,
  removeModerator,
};
