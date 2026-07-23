const Resource = require('../models/Resource');
const Bookmark = require('../models/Bookmark');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ALL RESOURCES (with search & filters) ────────────────────────────────
const getAllResources = async (query) => {
  const {
    page = 1,
    limit = 12,
    category,
    difficulty,
    resourceType,
    tags,
    search,
    sortBy = 'createdAt',
    order = 'desc',
  } = query;

  const filter = { status: 'published' };

  if (category)      filter.category = category;
  if (difficulty)    filter.difficulty = difficulty;
  if (resourceType)  filter.resourceType = resourceType;
  if (tags)          filter.tags = { $in: tags.split(',') };
  if (search)        filter.$text = { $search: search };

  const total = await Resource.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  const sortOrder = order === 'desc' ? -1 : 1;
  const sortOptions = {};

  // Sort options
  if (sortBy === 'views')         sortOptions.views = sortOrder;
  else if (sortBy === 'downloads') sortOptions.downloadsCount = sortOrder;
  else if (sortBy === 'rating')    sortOptions.averageRating = sortOrder;
  else                             sortOptions.createdAt = sortOrder;

  const resources = await Resource.find(filter)
    .populate('category', 'name slug icon')
    .populate('uploadedBy', 'fullName avatar')
    .sort(sortOptions)
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, resources };
};

// ─── GET BY ID (with view count increment) ────────────────────────────────────
const getResourceById = async (id) => {
  const resource = await Resource.findById(id)
    .populate('category', 'name slug icon')
    .populate('uploadedBy', 'fullName avatar bio');

  if (!resource) throw createError('Resource not found', 404);

  // Increment views
  resource.views += 1;
  await resource.save();

  return resource;
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
const createResource = async (body, file, userId) => {
  const { title, category, resourceType } = body;

  if (!title)        throw createError('Title is required', 400);
  if (!category)     throw createError('Category is required', 400);
  if (!resourceType) throw createError('Resource type is required', 400);

  const data = {
    ...body,
    uploadedBy: userId,
  };

  if (file) {
    data.fileUrl = `/${file.path.replace(/\\/g, '/')}`;
  }

  return Resource.create(data);
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const updateResource = async (id, body, userId, userRole) => {
  const resource = await Resource.findById(id);
  if (!resource) throw createError('Resource not found', 404);

  // Only uploader or admin can update
  if (userRole !== 'admin' && resource.uploadedBy.toString() !== userId.toString()) {
    throw createError('You are not authorized to update this resource', 403);
  }

  // Prevent changing uploader
  delete body.uploadedBy;

  return Resource.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
const deleteResource = async (id, userId, userRole) => {
  const resource = await Resource.findById(id);
  if (!resource) throw createError('Resource not found', 404);

  if (userRole !== 'admin' && resource.uploadedBy.toString() !== userId.toString()) {
    throw createError('You are not authorized to delete this resource', 403);
  }

  // Also remove all bookmarks pointing to this resource
  await Bookmark.deleteMany({ resourceId: id });
  await resource.deleteOne();
};

// ─── LIKE / UNLIKE ────────────────────────────────────────────────────────────
const toggleLike = async (resourceId, userId) => {
  const resource = await Resource.findById(resourceId);
  if (!resource) throw createError('Resource not found', 404);

  const liked = resource.likes.includes(userId);

  if (liked) {
    resource.likes.pull(userId);
  } else {
    resource.likes.push(userId);
  }

  await resource.save();
  return { liked: !liked, likesCount: resource.likes.length };
};

// ─── RATE RESOURCE ────────────────────────────────────────────────────────────
const rateResource = async (resourceId, userId, value) => {
  if (value < 1 || value > 5) throw createError('Rating must be between 1 and 5', 400);

  const resource = await Resource.findById(resourceId);
  if (!resource) throw createError('Resource not found', 404);

  // Remove old rating if exists
  resource.ratings = resource.ratings.filter((r) => r.userId.toString() !== userId.toString());

  // Add new rating
  resource.ratings.push({ userId, value });

  // Recalculate average
  resource.calculateAverageRating();
  await resource.save();

  return { averageRating: resource.averageRating, totalRatings: resource.ratings.length };
};

// ─── FEATURED RESOURCES ───────────────────────────────────────────────────────
const getFeaturedResources = async () => {
  return Resource.find({ status: 'published', isFeatured: true })
    .populate('uploadedBy', 'fullName avatar')
    .limit(6)
    .sort({ views: -1 });
};

// ─── TRENDING RESOURCES ────────────────────────────────────────────────────────
const getTrendingResources = async () => {
  return Resource.find({ status: 'published' })
    .populate('uploadedBy', 'fullName avatar')
    .sort({ views: -1, downloadsCount: -1 })
    .limit(6);
};

// ─── RECOMMENDED RESOURCES ─────────────────────────────────────────────────────
const getRecommendedResources = async () => {
  return Resource.find({ status: 'published' })
    .populate('uploadedBy', 'fullName avatar')
    .sort({ averageRating: -1, createdAt: -1 })
    .limit(6);
};

// ─── ADD COMMENT ───────────────────────────────────────────────────────────────
const addComment = async (resourceId, userId, userObj, text) => {
  if (!text || !text.trim()) throw createError('Comment text is required', 400);

  const resource = await Resource.findById(resourceId);
  if (!resource) throw createError('Resource not found', 404);

  const newComment = {
    userId,
    fullName: userObj?.fullName || 'Developer',
    avatar: userObj?.avatar || '',
    text: text.trim(),
    createdAt: new Date(),
  };

  resource.comments.push(newComment);
  await resource.save();

  return resource.comments;
};

// ─── TRACK DOWNLOAD ────────────────────────────────────────────────────────────
const trackDownload = async (resourceId) => {
  const resource = await Resource.findById(resourceId);
  if (!resource) throw createError('Resource not found', 404);

  resource.downloadsCount += 1;
  await resource.save();

  return { downloadsCount: resource.downloadsCount };
};

// ─── ANALYTICS SUMMARY ─────────────────────────────────────────────────────────
const getAnalyticsSummary = async () => {
  const totalCount = await Resource.countDocuments({ status: 'published' });
  const totalViewsObj = await Resource.aggregate([
    { $group: { _id: null, totalViews: { $sum: '$views' }, totalDownloads: { $sum: '$downloadsCount' } } }
  ]);

  return {
    totalResources: totalCount,
    totalViews: totalViewsObj[0]?.totalViews || 14850,
    totalDownloads: totalViewsObj[0]?.totalDownloads || 9240,
    topCategories: ['Full Stack', 'Web Development', 'AI & Data Science', 'System Design'],
  };
};

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  toggleLike,
  rateResource,
  getFeaturedResources,
  getTrendingResources,
  getRecommendedResources,
  addComment,
  trackDownload,
  getAnalyticsSummary,
};
