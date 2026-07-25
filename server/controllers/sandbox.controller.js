const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const sandboxService      = require('../services/sandbox.service');
const User                = require('../models/User');
const SandboxStep         = require('../models/SandboxStep');
const SandboxProject      = require('../models/SandboxProject');

const seedSandboxDatabase = async () => {
  try {
    const count = await SandboxProject.countDocuments();
    if (count > 0) return;

    // 1. Find or create instructor
    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      instructor = await User.create({
        fullName: 'Neha Sharma',
        username: 'nehasharma',
        email: 'neha@codesphere.com',
        password: 'password123',
        role: 'instructor',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
      });
    }

    // 2. Create the main E-commerce project
    const mainProj = await SandboxProject.create({
      title: 'Build an E-commerce Cart',
      description: 'Build a dynamic shopping cart with add/remove items, update quantity, and calculate total price.',
      instructor: instructor._id,
      difficulty: 'intermediate',
      category: 'frontend',
      technologyStack: ['HTML', 'CSS', 'JavaScript', 'Local Storage'],
      estimatedDuration: '4-6 hours',
      estimatedMinutes: 300,
      status: 'published',
      isPublished: true,
      isFeatured: true,
      enrolledCount: 2400,
      averageRating: 4.8,
      stepCount: 8,
    });

    // 3. Create the 8 steps
    const steps = [
      { stepNumber: 1, title: 'Project Setup', description: 'Initialize the HTML, CSS and JS files.' },
      { stepNumber: 2, title: 'Add Products', description: 'Display product list with name, price, and add to cart button.' },
      { stepNumber: 3, title: 'Add to Cart', description: 'Add functionality to add selected product to cart.', objectives: ['Add product to cart when Add to Cart is clicked', 'Prevent duplicate items', 'Update cart count in navbar', 'Show success message'], resources: ['MDN LocalStorage', 'JavaScript Array Methods'] },
      { stepNumber: 4, title: 'Update Quantity', description: 'Allow users to increase or decrease item quantity.' },
      { stepNumber: 5, title: 'Remove Items', description: 'Remove items from the cart.' },
      { stepNumber: 6, title: 'Calculate Total', description: 'Calculate and display total price of items.' },
      { stepNumber: 7, title: 'Persist Cart', description: 'Store cart data in localStorage.' },
      { stepNumber: 8, title: 'Polish UI', description: 'Improve UI/UX and make it responsive.' }
    ];

    for (const step of steps) {
      await SandboxStep.create({
        projectId: mainProj._id,
        ...step
      });
    }

    // 4. Create bookmarked projects
    await SandboxProject.create({
      title: 'Real-time Chat App',
      description: 'Build a chat application with websockets and real-time presence indicators.',
      instructor: instructor._id,
      difficulty: 'advanced',
      category: 'fullstack',
      technologyStack: ['React', 'Node.js', 'Socket.io'],
      estimatedDuration: '10-12 hours',
      estimatedMinutes: 660,
      status: 'published',
      isPublished: true,
    });

    await SandboxProject.create({
      title: 'Weather Dashboard',
      description: 'Fetch and display current weather details using standard rest APIs.',
      instructor: instructor._id,
      difficulty: 'beginner',
      category: 'frontend',
      technologyStack: ['HTML', 'CSS', 'JavaScript'],
      estimatedDuration: '2-3 hours',
      estimatedMinutes: 150,
      status: 'published',
      isPublished: true,
    });

    await SandboxProject.create({
      title: 'Task Manager',
      description: 'Manage individual tasks lists and filter statuses.',
      instructor: instructor._id,
      difficulty: 'intermediate',
      category: 'frontend',
      technologyStack: ['React', 'TailwindCSS'],
      estimatedDuration: '4-5 hours',
      estimatedMinutes: 270,
      status: 'published',
      isPublished: true,
    });
  } catch (err) {
    console.error('Error seeding sandbox database:', err);
  }
};

// GET /api/sandbox
const getAllProjects = asyncHandler(async (req, res) => {
  await seedSandboxDatabase();
  const data = await sandboxService.getAllProjects(req.query);
  return successResponse(res, 200, 'Sandbox projects fetched successfully', data);
});

// GET /api/sandbox/my
const getMyProjects = asyncHandler(async (req, res) => {
  await seedSandboxDatabase();
  const data = await sandboxService.getMyProjects(req.user._id, req.query);
  return successResponse(res, 200, 'My sandbox projects fetched successfully', data);
});

// GET /api/sandbox/:id
const getProjectById = asyncHandler(async (req, res) => {
  await seedSandboxDatabase();
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
