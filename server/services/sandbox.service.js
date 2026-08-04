const SandboxProject  = require('../models/SandboxProject');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ALL PROJECTS ─────────────────────────────────────────────────────────
const getAllProjects = async (query) => {
  const {
    page = 1,
    limit = 12,
    search,
    difficulty,
    category,
    instructor,
    technology,
    featured,
    sortBy = 'createdAt',
    order  = 'desc',
  } = query;

  const filter = { isPublished: true, status: 'published' };

  if (search)      filter.$text = { $search: search };
  if (difficulty)  filter.difficulty = difficulty;
  if (category)    filter.category   = category;
  if (instructor)  filter.instructor = instructor;
  if (technology)  filter.technologyStack = { $in: Array.isArray(technology) ? technology : [technology] };
  if (featured === 'true') filter.isFeatured = true;

  let total = await SandboxProject.countDocuments(filter).catch(() => 0);
  if (total === 0) {
    const { autoSeedIfEmpty } = require('../utils/autoSeed');
    await autoSeedIfEmpty().catch(() => {});
    total = await SandboxProject.countDocuments(filter).catch(() => 0);
  }

  const { skip, ...meta } = getPagination(page, limit, total);

  const sortOrder = order === 'desc' ? -1 : 1;
  const sortOptions = {};
  if (sortBy === 'popular')    sortOptions.enrolledCount  = -1;
  else if (sortBy === 'newest') sortOptions.createdAt     = -1;
  else if (sortBy === 'rating') sortOptions.averageRating = -1;
  else sortOptions[sortBy] = sortOrder;

  const projects = await SandboxProject.find(filter)
    .populate('instructor', 'fullName avatar bio')
    .sort(sortOptions)
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, projects };
};

// ─── GET PROJECT BY ID ────────────────────────────────────────────────────────
const getProjectById = async (id) => {
  const project = await SandboxProject.findById(id)
    .populate('instructor', 'fullName avatar bio email');

  if (!project) throw createError('Sandbox project not found', 404);

  // Increment view count
  project.viewCount += 1;
  await project.save();

  return project;
};

// ─── GET PROJECT BY SLUG ──────────────────────────────────────────────────────
const getProjectBySlug = async (slug) => {
  const project = await SandboxProject.findOne({ slug })
    .populate('instructor', 'fullName avatar bio email');

  if (!project) throw createError('Sandbox project not found', 404);

  project.viewCount += 1;
  await project.save();

  return project;
};

// ─── CREATE PROJECT ───────────────────────────────────────────────────────────
const createProject = async (body, userId) => {
  const { title } = body;
  if (!title) throw createError('Project title is required', 400);

  const existing = await SandboxProject.findOne({ title: title.trim() });
  if (existing) {
    throw createError('A project with this title already exists', 400);
  }

  return SandboxProject.create({ ...body, instructor: userId });
};

// ─── UPDATE PROJECT ───────────────────────────────────────────────────────────
const updateProject = async (id, body, userId, userRole) => {
  const project = await SandboxProject.findById(id);
  if (!project) throw createError('Sandbox project not found', 404);

  // Only instructor or admin can update
  if (project.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to update this project', 403);
  }

  delete body.instructor;

  return SandboxProject.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .populate('instructor', 'fullName avatar');
};

// ─── DELETE PROJECT ───────────────────────────────────────────────────────────
const deleteProject = async (id, userId, userRole) => {
  const project = await SandboxProject.findById(id);
  if (!project) throw createError('Sandbox project not found', 404);

  if (project.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to delete this project', 403);
  }

  await project.deleteOne();
};

// ─── PUBLISH PROJECT ──────────────────────────────────────────────────────────
const publishProject = async (id, userId, userRole) => {
  const project = await SandboxProject.findById(id);
  if (!project) throw createError('Sandbox project not found', 404);

  if (project.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to publish this project', 403);
  }

  if (project.isPublished) throw createError('Project is already published', 400);

  project.isPublished = true;
  project.status = 'published';
  await project.save();

  return project;
};

// ─── ARCHIVE PROJECT ──────────────────────────────────────────────────────────
const archiveProject = async (id, userId, userRole) => {
  const project = await SandboxProject.findById(id);
  if (!project) throw createError('Sandbox project not found', 404);

  if (project.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to archive this project', 403);
  }

  if (project.status === 'archived') throw createError('Project is already archived', 400);

  project.status = 'archived';
  project.isPublished = false;
  await project.save();

  return project;
};

// ─── GET MY PROJECTS (instructor view) ───────────────────────────────────────
const getMyProjects = async (userId, query) => {
  const { page = 1, limit = 12, status } = query;

  const filter = { instructor: userId };
  if (status) filter.status = status;

  const total = await SandboxProject.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  const projects = await SandboxProject.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, projects };
};

// ─── GET PROJECT STATS ────────────────────────────────────────────────────────
const getProjectStats = async (id, userId, userRole) => {
  const project = await SandboxProject.findById(id);
  if (!project) throw createError('Sandbox project not found', 404);

  if (project.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to view stats for this project', 403);
  }

  return {
    projectId:       project._id,
    title:           project.title,
    status:          project.status,
    viewCount:       project.viewCount,
    enrolledCount:   project.enrolledCount,
    completedCount:  project.completedCount,
    bookmarkCount:   project.bookmarkCount,
    downloadCount:   project.downloadCount,
    averageRating:   project.averageRating,
    completionRate:  project.enrolledCount > 0 ? ((project.completedCount / project.enrolledCount) * 100).toFixed(1) : 0,
  };
};

module.exports = {
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  publishProject,
  archiveProject,
  getMyProjects,
  getProjectStats,
};
