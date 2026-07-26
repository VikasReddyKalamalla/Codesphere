const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const sandboxService      = require('../services/sandbox.service');
const User                = require('../models/User');
const SandboxStep         = require('../models/SandboxStep');
const SandboxProject      = require('../models/SandboxProject');
const { seedMockData, getPaginatedProjects } = require('../services/mockSeed');

const seedSandboxDatabase = async () => {
  try {
    // Skip if using mock database
    if (process.env.NODE_ENV === 'development') {
      seedMockData();
      return;
    }

    const count = await SandboxProject.countDocuments();
    if (count > 0) return;

    // For production, we would seed MongoDB
    // This code is skipped in development mode
  } catch (err) {
    console.error('Error seeding sandbox database:', err);
  }
};

// GET /api/sandbox
const getAllProjects = asyncHandler(async (req, res) => {
  await seedSandboxDatabase();
  
  // Use mock data in development mode
  if (process.env.NODE_ENV === 'development') {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const data = getPaginatedProjects(page, limit);
    return successResponse(res, 200, 'Sandbox projects fetched successfully', data);
  }
  
  const data = await sandboxService.getAllProjects(req.query);
  return successResponse(res, 200, 'Sandbox projects fetched successfully', data);
});

// GET /api/sandbox/my
const getMyProjects = asyncHandler(async (req, res) => {
  await seedSandboxDatabase();
  
  if (process.env.NODE_ENV === 'development') {
    // Return empty array for now (no user projects in development mode)
    return successResponse(res, 200, 'My sandbox projects fetched successfully', { data: [], total: 0 });
  }
  
  const data = await sandboxService.getMyProjects(req.user._id, req.query);
  return successResponse(res, 200, 'My sandbox projects fetched successfully', data);
});

// GET /api/sandbox/:id
const getProjectById = asyncHandler(async (req, res) => {
  await seedSandboxDatabase();
  
  if (process.env.NODE_ENV === 'development') {
    const { getSandboxProjects } = require('../services/mockSeed');
    const projects = getSandboxProjects();
    const project = projects.find(p => p._id === req.params.id);
    if (!project) {
      return successResponse(res, 404, 'Project not found');
    }
    return successResponse(res, 200, 'Sandbox project fetched successfully', project);
  }
  
  const data = await sandboxService.getProjectById(req.params.id);
  return successResponse(res, 200, 'Sandbox project fetched successfully', data);
});

// GET /api/sandbox/slug/:slug
const getProjectBySlug = asyncHandler(async (req, res) => {
  await seedSandboxDatabase();
  const data = await sandboxService.getProjectBySlug(req.params.slug);
  return successResponse(res, 200, 'Sandbox project fetched successfully', data);
});

// POST /api/sandbox
const createProject = asyncHandler(async (req, res) => {
  const data = await sandboxService.createProject(req.body, req.user._id);
  return successResponse(res, 201, 'Sandbox project created successfully', data);
});

// PUT /api/sandbox/:id
const updateProject = asyncHandler(async (req, res) => {
  const data = await sandboxService.updateProject(req.params.id, req.body, req.user._id, req.user.role);
  return successResponse(res, 200, 'Sandbox project updated successfully', data);
});

// DELETE /api/sandbox/:id
const deleteProject = asyncHandler(async (req, res) => {
  await sandboxService.deleteProject(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Sandbox project deleted successfully');
});

// PATCH /api/sandbox/:id/publish
const publishProject = asyncHandler(async (req, res) => {
  const data = await sandboxService.publishProject(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Sandbox project published successfully', data);
});

// PATCH /api/sandbox/:id/archive
const archiveProject = asyncHandler(async (req, res) => {
  const data = await sandboxService.archiveProject(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Sandbox project archived successfully', data);
});

// GET /api/sandbox/:id/stats
const getProjectStats = asyncHandler(async (req, res) => {
  const data = await sandboxService.getProjectStats(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Sandbox project stats fetched successfully', data);
});

module.exports = {
  getAllProjects,
  getMyProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  publishProject,
  archiveProject,
  getProjectStats,
};
