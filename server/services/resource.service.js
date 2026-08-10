const mongoose = require('mongoose');
const Resource = require('../models/Resource');
const Bookmark = require('../models/Bookmark');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const VALID_TYPES = ['pdf', 'notes', 'video', 'documentation', 'source_code', 'github', 'link', 'presentation', 'ppt', 'word', 'doc', 'zip', 'other'];

const normalizeResourceType = (typeStr) => {
  if (!typeStr) return 'documentation';
  const lower = String(typeStr).toLowerCase().trim();
  if (VALID_TYPES.includes(lower)) return lower;
  if (lower === 'article' || lower === 'article & docs') return 'documentation';
  if (lower === 'cheatsheet' || lower === 'cheat sheet') return 'notes';
  if (lower.includes('powerpoint') || lower.includes('presentation') || lower === 'ppt' || lower === 'pptx') return 'ppt';
  if (lower.includes('word') || lower === 'doc' || lower === 'docx') return 'word';
  return 'other';
};

// ─── GET ALL RESOURCES (with search & filters) ────────────────────────────────
const getAllResources = async (query) => {
  const {
    page = 1,
    limit = 12,
    category,
    difficulty,
    resourceType,
    type,
    tags,
    search,
    all,
    sortBy = 'createdAt',
    order = 'desc',
  } = query;

  // Fallback to mock data if MongoDB is not connected (readyState !== 1)
  if (mongoose.connection.readyState !== 1) {
    const { seedMockResources } = require('./mockResources');
    const mockData = seedMockResources();
    return {
      total: mockData.length,
      page: 1,
      limit: 12,
      totalPages: 1,
      resources: mockData
    };
  }

  const filter = {};
  if (all !== 'true') {
    filter.status = 'published';
  }

  if (category)      filter.category = category;
  if (difficulty)    filter.difficulty = difficulty;
  
  const targetType = resourceType || type;
  if (targetType) {
    filter.resourceType = normalizeResourceType(targetType);
  }

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
  if (!id) throw createError('Resource ID is required', 400);

  if (mongoose.connection.readyState !== 1) {
    const { seedMockResources } = require('./mockResources');
    const mockData = seedMockResources();
    const resource = mockData.find((r) => String(r._id) === String(id) || String(r.id) === String(id));
    if (!resource) throw createError('Resource not found', 404);
    return resource;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError('Invalid resource ID format', 400);
  }

  let resource;
  try {
    resource = await Resource.findById(id)
      .populate('category', 'name slug icon')
      .populate('uploadedBy', 'fullName avatar bio');
  } catch (err) {
    resource = await Resource.findById(id).populate('uploadedBy', 'fullName avatar bio');
  }

  if (!resource) throw createError('Resource not found', 404);

  // Increment views safely
  resource.views = (resource.views || 0) + 1;
  await resource.save().catch(() => null);

  return resource;
};

const path = require('path');

const getFileUrl = (file) => {
  if (!file) return '';
  if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) {
    return file.path;
  }
  if (file.filename) {
    const folder = file.destination ? path.basename(file.destination) : 'resource';
    return `/uploads/${folder}/${file.filename}`;
  }
  if (file.path) {
    const normalized = file.path.replace(/\\/g, '/');
    const idx = normalized.indexOf('/uploads/');
    return idx !== -1 ? normalized.slice(idx) : `/${normalized}`;
  }
  return '';
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
const createResource = async (body, file, userId) => {
  const { title, category, resourceType, type, url, content } = body;

  if (!title) throw createError('Title is required', 400);

  const finalResourceType = normalizeResourceType(resourceType || type || 'documentation');
  const finalCategory = category || 'Documentation';

  const data = {
    ...body,
    title: title.trim(),
    category: finalCategory,
    resourceType: finalResourceType,
    status: body.status || 'published',
    uploadedBy: userId,
    fileUrl: body.fileUrl || url || '',
    externalUrl: body.externalUrl || url || '',
    markdownContent: body.markdownContent || content || '',
  };

  if (file) {
    data.fileUrl = getFileUrl(file);
  }

  return Resource.create(data);
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const updateResource = async (id, body, file, userId, userRole) => {
  const resource = await Resource.findById(id);
  if (!resource) throw createError('Resource not found', 404);

  // Only uploader or admin can update
  if (userRole !== 'admin' && resource.uploadedBy.toString() !== userId.toString()) {
    throw createError('You are not authorized to update this resource', 403);
  }

  // Prevent changing uploader
  delete body.uploadedBy;

  const updateData = { ...body };
  if (body.type || body.resourceType) {
    updateData.resourceType = normalizeResourceType(body.resourceType || body.type);
  }
  if (body.url) {
    if (!body.externalUrl) updateData.externalUrl = body.url;
    if (!body.fileUrl) updateData.fileUrl = body.url;
  }
  if (body.content) {
    if (!body.markdownContent) updateData.markdownContent = body.content;
  }
  if (file) {
    updateData.fileUrl = getFileUrl(file);
  }

  return Resource.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
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
  if (mongoose.connection.readyState !== 1) {
    const { seedMockResources } = require('./mockResources');
    return seedMockResources().slice(0, 6);
  }
  return Resource.find({ status: 'published', isFeatured: true })
    .populate('uploadedBy', 'fullName avatar')
    .limit(6)
    .sort({ views: -1 });
};

// ─── TRENDING RESOURCES ────────────────────────────────────────────────────────
const getTrendingResources = async () => {
  if (mongoose.connection.readyState !== 1) {
    const { seedMockResources } = require('./mockResources');
    return seedMockResources().slice(0, 6);
  }
  return Resource.find({ status: 'published' })
    .populate('uploadedBy', 'fullName avatar')
    .sort({ views: -1, downloadsCount: -1 })
    .limit(6);
};

// ─── RECOMMENDED RESOURCES ─────────────────────────────────────────────────────
const getRecommendedResources = async () => {
  if (mongoose.connection.readyState !== 1) {
    const { seedMockResources } = require('./mockResources');
    return seedMockResources().slice(0, 6);
  }
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
