const Channel = require('../models/Channel');
const Community = require('../models/Community');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const DEFAULT_CHANNEL_TEMPLATES = [
  {
    name: 'announcements',
    slug: 'announcements',
    category: 'Information',
    type: 'announcement',
    topic: 'Official announcements, updates, and releases for this community.',
    order: 0,
    allowedRoles: ['owner', 'admin', 'moderator'],
  },
  {
    name: 'general',
    slug: 'general',
    category: 'General',
    type: 'text',
    topic: 'General developer discussions, architecture talks, and networking.',
    order: 1,
  },
  {
    name: 'code-showcase',
    slug: 'code-showcase',
    category: 'Showcase',
    type: 'text',
    topic: 'Share your open source projects, code snippets, and live demos.',
    order: 2,
  },
  {
    name: 'help-forum',
    slug: 'help-forum',
    category: 'Support',
    type: 'forum',
    topic: 'Ask technical questions, debug errors, and collaborate on solutions.',
    order: 3,
  },
  {
    name: 'random',
    slug: 'random',
    category: 'General',
    type: 'text',
    topic: 'Off-topic banter, developer memes, tech news, and casual talks.',
    order: 4,
  },
];

/**
 * Ensure standard enterprise channels exist for a community.
 */
const ensureDefaultChannels = async (communityId) => {
  const existingCount = await Channel.countDocuments({ community: communityId });
  if (existingCount > 0) {
    return Channel.find({ community: communityId }).sort({ order: 1 });
  }

  const createdChannels = [];
  for (const tpl of DEFAULT_CHANNEL_TEMPLATES) {
    const ch = await Channel.create({
      ...tpl,
      community: communityId,
    });
    createdChannels.push(ch);
  }

  // Update community with default channel and channel list
  const generalChannel = createdChannels.find((c) => c.slug === 'general') || createdChannels[0];
  await Community.findByIdAndUpdate(communityId, {
    channels: createdChannels.map((c) => c._id),
    defaultChannel: generalChannel._id,
    channelCategories: [
      { name: 'Information', order: 0 },
      { name: 'General', order: 1 },
      { name: 'Showcase', order: 2 },
      { name: 'Support', order: 3 },
    ],
  });

  return createdChannels;
};

/**
 * Get all channels for a community grouped by category.
 */
const getCommunityChannels = async (communityId) => {
  let channels = await Channel.find({ community: communityId }).sort({ order: 1, createdAt: 1 });
  
  if (!channels || channels.length === 0) {
    channels = await ensureDefaultChannels(communityId);
  }

  // Group by category
  const categories = {};
  for (const ch of channels) {
    const cat = ch.category || 'General';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(ch);
  }

  return {
    channels,
    categorized: categories,
  };
};

/**
 * Get channel by ID
 */
const getChannelById = async (channelId) => {
  const channel = await Channel.findById(channelId).populate('community', 'name logo owner moderators members');
  if (!channel) throw createError('Channel not found', 404);
  return channel;
};

/**
 * Create a new channel
 */
const createChannel = async (communityId, body, userId) => {
  const community = await Community.findById(communityId);
  if (!community) throw createError('Community not found', 404);

  const isOwner = community.owner.toString() === userId.toString();
  const isMod = community.moderators.some((m) => m.toString() === userId.toString());
  if (!isOwner && !isMod) {
    throw createError('Only community owners or moderators can create channels', 403);
  }

  const cleanName = body.name.toLowerCase().trim().replace(/\s+/g, '-');
  const existing = await Channel.findOne({ community: communityId, name: cleanName });
  if (existing) throw createError('A channel with this name already exists in this community', 409);

  const count = await Channel.countDocuments({ community: communityId });

  const channel = await Channel.create({
    community: communityId,
    name: cleanName,
    slug: cleanName,
    category: body.category || 'General',
    topic: body.topic || '',
    type: body.type || 'text',
    isPrivate: body.isPrivate || false,
    allowedRoles: body.allowedRoles || [],
    slowModeSeconds: body.slowModeSeconds || 0,
    order: count,
  });

  await Community.findByIdAndUpdate(communityId, {
    $addToSet: { channels: channel._id },
  });

  return channel;
};

/**
 * Update a channel
 */
const updateChannel = async (channelId, body, userId) => {
  const channel = await Channel.findById(channelId);
  if (!channel) throw createError('Channel not found', 404);

  const community = await Community.findById(channel.community);
  const isOwner = community.owner.toString() === userId.toString();
  const isMod = community.moderators.some((m) => m.toString() === userId.toString());
  if (!isOwner && !isMod) {
    throw createError('Not authorized to edit channel', 403);
  }

  if (body.name) {
    body.name = body.name.toLowerCase().trim().replace(/\s+/g, '-');
    body.slug = body.name;
  }

  const updated = await Channel.findByIdAndUpdate(channelId, body, { new: true, runValidators: true });
  return updated;
};

/**
 * Delete a channel
 */
const deleteChannel = async (channelId, userId) => {
  const channel = await Channel.findById(channelId);
  if (!channel) throw createError('Channel not found', 404);

  const community = await Community.findById(channel.community);
  const isOwner = community.owner.toString() === userId.toString();
  if (!isOwner) {
    throw createError('Only the community owner can delete channels', 403);
  }

  if (community.defaultChannel && community.defaultChannel.toString() === channelId.toString()) {
    throw createError('Cannot delete the default community channel', 400);
  }

  await Channel.findByIdAndDelete(channelId);
  await Community.findByIdAndUpdate(channel.community, {
    $pull: { channels: channelId },
  });

  return { message: 'Channel deleted successfully' };
};

module.exports = {
  ensureDefaultChannels,
  getCommunityChannels,
  getChannelById,
  createChannel,
  updateChannel,
  deleteChannel,
};
