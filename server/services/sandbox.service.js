const SandboxProject  = require('../models/SandboxProject');
const User            = require('../models/User');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Default initial problem statements to seed if MongoDB has 0 sandbox projects
const DEFAULT_INITIAL_PROBLEMS = [
  {
    title: 'Build a Real-Time E-Commerce Shopping Cart System',
    category: 'Frontend & UI Systems',
    difficulty: 'intermediate',
    pitch: 'Develop a responsive, stateful shopping cart system with real-time price calculation, quantity updates, duplicate prevention, and persistent localStorage state.',
    description: 'In modern web applications, the shopping cart is the heart of e-commerce conversions. You will construct a modular, component-driven cart system that seamlessly updates totals, handles item removal animations, and syncs cart state across browser reloads.',
    technologyStack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Local Storage'],
    estimatedDuration: '2.5 Hours',
    points: 250,
    enrolledCount: 3400,
    isPublished: true,
    status: 'published',
    flashcards: [
      {
        title: '💡 Algorithmic State Management',
        hint: 'Use JavaScript Array.reduce() to dynamically calculate cart total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).'
      },
      {
        title: '🛠️ LocalStorage Synchronization',
        hint: 'Serialize your cart array using JSON.stringify(cart) before saving to localStorage.getItem("cs_cart") and JSON.parse() on load.'
      },
      {
        title: '📚 MDN Web API References',
        hint: 'Explore Element.querySelectorAll(), Event Bubbling for cart item removal, and CustomEvents for badge updates.'
      }
    ],
    starterFiles: ['index.html', 'styles.css', 'script.js']
  },
  {
    title: 'High-Performance Custom Vite AST Compiler Plugin',
    category: 'System Design & Compilers',
    difficulty: 'advanced',
    pitch: 'Build a custom Vite plugin that parses JavaScript Abstract Syntax Trees (AST), rewrites imports, injects telemetry hooks, and optimizes production bundles.',
    description: 'Compilers and bundler plugins are essential for modern web infrastructure. You will implement a custom Vite build plugin using Babel AST transforms to automate code instrumentation, strip debug code, and analyze bundle dependency graphs in real-time.',
    technologyStack: ['TypeScript', 'Vite', 'Babel AST', 'Node.js'],
    estimatedDuration: '4 Hours',
    points: 450,
    enrolledCount: 1800,
    isPublished: true,
    status: 'published',
    flashcards: [
      {
        title: '💡 AST Node Manipulation',
        hint: 'Use @babel/traverse to visit Identifier and CallExpression nodes in the AST to safely inject diagnostic metrics without altering execution flow.'
      },
      {
        title: '🛠️ Vite Rollup Plugin Lifecycle',
        hint: 'Implement standard Vite hooks: resolveId(), load(), and transform(code, id) to intercept source code before module bundling.'
      },
      {
        title: '📚 Official Specs & Documentation',
        hint: 'Refer to ESTree AST Specification and Vite Plugin API reference for plugin configuration patterns.'
      }
    ],
    starterFiles: ['vite.config.ts', 'plugin.ts', 'index.ts']
  },
  {
    title: 'Distributed Key-Value Store & LRU Cache Engine',
    category: 'System Design & Compilers',
    difficulty: 'expert',
    pitch: 'Design and implement an in-memory Key-Value store with O(1) Least Recently Used (LRU) cache eviction using a Doubly Linked List and Hash Map.',
    description: 'High-concurrency cache servers like Redis rely on O(1) lookup and eviction strategies. In this challenge, you will implement a thread-safe LRU cache engine in C++/Go featuring atomic operations, expiration TTL, and memory compaction algorithms.',
    technologyStack: ['C++', 'Go', 'Data Structures', 'System Architecture'],
    estimatedDuration: '5 Hours',
    points: 600,
    enrolledCount: 1200,
    isPublished: true,
    status: 'published',
    flashcards: [
      {
        title: '💡 O(1) Eviction Mechanism',
        hint: 'Combine a std::unordered_map for O(1) key lookup with a std::list (doubly linked list) to maintain access order. Move accessed nodes to head in O(1).'
      },
      {
        title: '🛠️ Concurrency & Lock Management',
        hint: 'Use std::shared_mutex or read-write locks to permit concurrent reads while enforcing exclusive write locks during node eviction.'
      },
      {
        title: '📚 Systems Architecture References',
        hint: 'Review Memory Layout, Cache Line Alignment, and Lock-Free Queue primitives.'
      }
    ],
    starterFiles: ['lru_cache.cpp', 'main.cpp', 'Makefile']
  },
  {
    title: 'JWT Authentication & RBAC Access Control Microservice',
    category: 'Backend & APIs',
    difficulty: 'intermediate',
    pitch: 'Construct a secure REST API authentication server featuring JSON Web Tokens, refresh token rotation, password hashing with bcrypt, and Role-Based Access Control (RBAC).',
    description: 'Security is paramount in backend software engineering. You will build a production-grade authentication microservice with Express & MongoDB, featuring encrypted cookie management, role authorization middleware (admin vs student vs instructor), and rate limiting.',
    technologyStack: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Bcrypt'],
    estimatedDuration: '3 Hours',
    points: 350,
    enrolledCount: 4100,
    isPublished: true,
    status: 'published',
    flashcards: [
      {
        title: '💡 Token Rotation Strategy',
        hint: 'Store short-lived Access Tokens (15m) in memory/authorization headers and HTTP-only Secure Refresh Tokens (7d) in encrypted cookies.'
      },
      {
        title: '🛠️ RBAC Middleware Pattern',
        hint: 'Create a reusable restrictTo(...allowedRoles) higher-order function that verifies req.user.role before executing protected route controllers.'
      },
      {
        title: '📚 OWASP Security Guidelines',
        hint: 'Review OWASP API Security Top 10 for preventing Broken Object Level Authorization (BOLA) and Brute Force attacks.'
      }
    ],
    starterFiles: ['server.js', 'auth.controller.js', 'auth.middleware.js']
  },
  {
    title: 'Real-Time Collaborative Web Socket Chat Engine',
    category: 'Backend & APIs',
    difficulty: 'intermediate',
    pitch: 'Develop a real-time multi-room messaging engine with Socket.IO, typing indicators, user online presence tracking, and message history persistence.',
    description: 'Real-time collaboration powers modern platforms like CodeSphere. You will build a WebSocket server and client UI that broadcasts real-time chat messages, syncs active typing states across rooms, and handles re-connections smoothly.',
    technologyStack: ['React', 'Socket.IO', 'Express.js', 'Node.js'],
    estimatedDuration: '3.5 Hours',
    points: 400,
    enrolledCount: 2900,
    isPublished: true,
    status: 'published',
    flashcards: [
      {
        title: '💡 WebSocket Room Broadcasting',
        hint: 'Use io.to(roomId).emit("message:received", data) to deliver events exclusively to participants in the active room.'
      },
      {
        title: '🛠️ Debounced Typing Indicators',
        hint: 'Emit "typing:start" on keypress and set a 2-second timeout to automatically emit "typing:stop" when user stops typing.'
      },
      {
        title: '📚 Socket.IO Protocol Docs',
        hint: 'Study Socket.IO heartbeat ping/pong timeouts, fallback polling transports, and room join/leave lifecycle.'
      }
    ],
    starterFiles: ['server.js', 'socket.js', 'ChatRoom.jsx']
  },
  {
    title: 'Core Web Vitals Performance Optimization Engine',
    category: 'Frontend & UI Systems',
    difficulty: 'advanced',
    pitch: 'Diagnose and optimize a web application to achieve 95+ Lighthouse scores across Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS).',
    description: 'Web performance directly impacts user retention and search engine rankings. You will profile memory leaks, optimize font loading, implement code splitting, defer non-critical scripts, and optimize image rendering for instant loads.',
    technologyStack: ['JavaScript', 'Web Vitals API', 'CSS Grid', 'Lighthouse'],
    estimatedDuration: '3 Hours',
    points: 350,
    enrolledCount: 1900,
    isPublished: true,
    status: 'published',
    flashcards: [
      {
        title: '💡 LCP & CLS Optimization',
        hint: 'Preload critical hero images using <link rel="preload"> and specify width/height attributes on img tags to eliminate layout shifts.'
      },
      {
        title: '🛠️ PerformanceObserver API',
        hint: 'Use PerformanceObserver to programmatically record LCP, FID, and CLS entries directly in your web app for analytics monitoring.'
      },
      {
        title: '📚 Web.dev Performance Guidelines',
        hint: 'Review Google Core Web Vitals threshold benchmarks and Chrome DevTools Performance Profiler workflows.'
      }
    ],
    starterFiles: ['index.html', 'perf-tracker.js', 'styles.css']
  }
];

// Helper to auto-seed if collection is completely empty
const ensureInitialProjects = async () => {
  const count = await SandboxProject.countDocuments({});
  if (count === 0) {
    const adminUser = await User.findOne({ role: { $in: ['admin', 'instructor'] } });
    const instructorId = adminUser ? adminUser._id : new require('mongoose').Types.ObjectId();
    const docs = DEFAULT_INITIAL_PROBLEMS.map((p) => ({
      ...p,
      instructor: instructorId,
    }));
    await SandboxProject.insertMany(docs);
  }
};

// ─── GET ALL PROJECTS ─────────────────────────────────────────────────────────
const getAllProjects = async (query) => {
  await ensureInitialProjects();
  const {
    page = 1,
    limit = 50,
    search,
    difficulty,
    category,
    instructor,
    technology,
    featured,
    sortBy = 'createdAt',
    order  = 'desc',
  } = query;

  const filter = {};
  const andConditions = [];

  if (query.all !== 'true') {
    andConditions.push({
      $or: [{ isPublished: true }, { status: 'published' }]
    });
  }

  if (search) {
    andConditions.push({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { pitch: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { technologyStack: { $regex: search, $options: 'i' } },
      ]
    });
  }

  if (difficulty)  filter.difficulty = difficulty;
  if (category)    filter.category   = category;
  if (instructor)  filter.instructor = instructor;
  if (technology)  filter.technologyStack = { $in: Array.isArray(technology) ? technology : [technology] };
  if (featured === 'true') filter.isFeatured = true;

  if (andConditions.length > 0) {
    filter.$and = andConditions;
  }

  const limitNum = parseInt(limit, 10) || 50;
  const total = await SandboxProject.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limitNum, total);

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

  if (!body.category || typeof body.category !== 'string') {
    body.category = 'Full Stack';
  } else {
    body.category = body.category.trim();
  }

  if (body.isPublished || body.isPublished === 'true') {
    body.isPublished = true;
    body.status = 'published';
  } else {
    body.status = body.status || 'published';
    body.isPublished = true;
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

  if (body.category && typeof body.category === 'string') {
    body.category = body.category.trim();
  }

  if (typeof body.isPublished !== 'undefined') {
    if (body.isPublished || body.isPublished === 'true') {
      body.isPublished = true;
      body.status = 'published';
    } else {
      body.isPublished = false;
      body.status = 'draft';
    }
  }

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
