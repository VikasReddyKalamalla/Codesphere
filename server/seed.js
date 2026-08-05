/**
 * CodeSphere — Complete Database Seed Script
 * Run: node seed.js
 * Seeds all collections with realistic sample data.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ─── Models ───────────────────────────────────────────────────────────────────
const User               = require('./models/User');
const LearningPath       = require('./models/LearningPath');
const Module             = require('./models/Module');
const Lesson             = require('./models/Lesson');
const SandboxProject     = require('./models/SandboxProject');
const SandboxStep        = require('./models/SandboxStep');
const Community          = require('./models/Community');
const Post               = require('./models/Post');
const Event              = require('./models/Event');
const EventCategory      = require('./models/EventCategory');
const Test               = require('./models/Test');
const Question           = require('./models/Question');
const Resource           = require('./models/Resource');
const SubscriptionPlan   = require('./models/SubscriptionPlan');
const Workspace          = require('./models/Workspace');
const Notification       = require('./models/Notification');

const connectDB = require('./config/db');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const hash = (p) => bcrypt.hash(p, 12);
const pick  = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
  await connectDB();
  console.log('Connected to MongoDB. Starting seed...\n');

  // ── 0. Wipe existing data ──────────────────────────────────────────────────
  const collections = [
    User, LearningPath, Module, Lesson,
    SandboxProject, SandboxStep,
    Community, Post,
    Event, EventCategory,
    Test, Question,
    Resource, SubscriptionPlan,
    Workspace, Notification,
  ];
  for (const col of collections) {
    await col.deleteMany({});
  }
  // Also clear ResourceCategory separately since it's loaded dynamically below
  const ResourceCategoryEarly = mongoose.models.ResourceCategory || require('./models/ResourceCategory');
  await ResourceCategoryEarly.deleteMany({});
  console.log('✓ Cleared existing documents\n');

  // ── 1. Subscription Plans ─────────────────────────────────────────────────
  const plans = await SubscriptionPlan.insertMany([
    {
      name: 'free', displayName: 'Free', sortOrder: 1,
      description: 'Get started with the basics. No credit card required.',
      tagline: 'Perfect for beginners',
      monthlyPrice: 0, yearlyPrice: 0,
      features: {
        learningPaths: 3, resources: false, createCommunities: false,
        joinSessions: false, codexAccess: false, sandboxAccess: true,
        testsAccess: true, analyticsAccess: false, eventRegistration: true,
        aiRoadmap: false, prioritySupport: false,
      },
    },
    {
      name: 'standard', displayName: 'Standard', sortOrder: 2,
      description: 'Full access to learning, sessions, resources and communities.',
      tagline: 'Most popular for students', badge: 'Most Popular',
      monthlyPrice: 499, yearlyPrice: 4999, isFeatured: true,
      features: {
        learningPaths: -1, resources: true, createCommunities: true,
        joinSessions: true, codexAccess: true, privateCodex: false,
        sandboxAccess: true, testsAccess: true, analyticsAccess: true,
        eventRegistration: true, aiRoadmap: false, prioritySupport: false,
      },
    },
    {
      name: 'premium', displayName: 'Premium', sortOrder: 3,
      description: 'Everything in Standard plus advanced analytics, AI roadmap, and priority support.',
      tagline: 'For serious engineers and teams',
      monthlyPrice: 999, yearlyPrice: 9999,
      features: {
        learningPaths: -1, resources: true, createCommunities: true,
        joinSessions: true, codexAccess: true, privateCodex: true,
        sandboxAccess: true, advancedSandbox: true, testsAccess: true,
        analyticsAccess: true, advancedAnalytics: true,
        eventRegistration: true, aiRoadmap: true, privatesCommunities: true,
        prioritySupport: true,
      },
    },
  ]);
  console.log(`✓ Seeded ${plans.length} subscription plans`);

  // ── 2. Users ──────────────────────────────────────────────────────────────
  const pw       = await hash('Password123!');
  const adminPw  = await hash('admin123');
  const instrPw  = await hash('instructor123');
  const users = await User.insertMany([
    {
      fullName: 'Vikas Reddy',    username: 'vikasreddy',
      email: 'vikas@example.com', password: pw,
      role: 'student', plan: 'standard',
      bio: 'CS student passionate about full-stack development.',
      achievementPoints: 1240, dayStreak: 7, isActive: true,
    },
    {
      fullName: 'Sarah Chen',     username: 'sarahchen',
      email: 'instructor@gmail.com', password: instrPw,
      role: 'instructor', plan: 'premium', isInstructor: true,
      applicationStatus: 'approved',
      bio: 'Senior engineer at Google. Teaching React and Node.js.',
      achievementPoints: 5800, dayStreak: 42, isActive: true,
    },
    {
      fullName: 'James Okafor',   username: 'jamesokafor',
      email: 'instructor2@gmail.com', password: instrPw,
      role: 'instructor', plan: 'premium', isInstructor: true,
      applicationStatus: 'approved',
      bio: 'Python & ML enthusiast. 8 years in data engineering.',
      achievementPoints: 4200, dayStreak: 30, isActive: true,
    },
    {
      fullName: 'Priya Nair',     username: 'priyanair',
      email: 'priya@example.com', password: pw,
      role: 'student', plan: 'standard',
      bio: 'Learning React and building side projects.',
      achievementPoints: 820, dayStreak: 5, isActive: true,
    },
    {
      fullName: 'Admin User',     username: 'adminuser',
      email: 'admin@codesphere.dev', password: adminPw,
      role: 'admin', plan: 'premium', isActive: true,
      bio: 'Platform administrator.',
    },
    {
      fullName: 'Alex Thompson',  username: 'alexthompson',
      email: 'alex@example.com', password: pw,
      role: 'student', plan: 'free',
      bio: 'Beginner coder, learning JavaScript.',
      achievementPoints: 320, dayStreak: 2, isActive: true,
    },
  ]);
  const [vikas, sarah, james, priya, admin, alex] = users;
  console.log(`✓ Seeded ${users.length} users`);

  // ── 3. Learning Paths ─────────────────────────────────────────────────────
  const paths = await LearningPath.insertMany([
    {
      title: 'Full-Stack JavaScript Development',
      description: 'Master Node.js, Express, React, and MongoDB. Build production-ready applications from scratch.',
      category: 'Web Development', difficulty: 'intermediate',
      duration: 1200, rating: 4.8, totalStudents: 340,
      createdBy: sarah._id, isPublished: true, isPremium: false,
    },
    {
      title: 'Python for Data Engineering',
      description: 'Learn Python, pandas, NumPy, SQL, and build real data pipelines. Industry-level curriculum.',
      category: 'Data Science', difficulty: 'advanced',
      duration: 900, rating: 4.6, totalStudents: 210,
      createdBy: james._id, isPublished: true, isPremium: true,
    },
    {
      title: 'React & TypeScript Masterclass',
      description: 'From zero to production — hooks, context, Redux Toolkit, testing, and deployment.',
      category: 'Frontend', difficulty: 'intermediate',
      duration: 720, rating: 4.9, totalStudents: 520,
      createdBy: sarah._id, isPublished: true, isPremium: false,
    },
    {
      title: 'System Design Fundamentals',
      description: 'Scalable systems, load balancers, databases, caching, message queues, and real-world architecture patterns.',
      category: 'Software Engineering', difficulty: 'advanced',
      duration: 600, rating: 4.7, totalStudents: 180,
      createdBy: james._id, isPublished: true, isPremium: true,
    },
  ]);
  console.log(`✓ Seeded ${paths.length} learning paths`);

  // ── 4. Modules & Lessons ──────────────────────────────────────────────────
  const mod1 = await Module.create({
    learningPathId: paths[0]._id, title: 'JavaScript Fundamentals', order: 1,
    description: 'Variables, types, functions, async/await, and ES6+ features.', duration: 180,
  });
  const mod2 = await Module.create({
    learningPathId: paths[0]._id, title: 'Node.js & Express', order: 2,
    description: 'Build REST APIs, middleware, authentication, and file uploads.', duration: 240,
  });
  const mod3 = await Module.create({
    learningPathId: paths[2]._id, title: 'React Core Concepts', order: 1,
    description: 'Components, props, state, hooks, and lifecycle.', duration: 200,
  });

  const lessons = await Lesson.insertMany([
    { moduleId: mod1._id, title: 'Variables and Data Types',   type: 'video',   videoUrl: 'https://example.com/l1', duration: 25, order: 1, isFree: true  },
    { moduleId: mod1._id, title: 'Functions & Arrow Functions', type: 'video',   videoUrl: 'https://example.com/l2', duration: 30, order: 2, isFree: true  },
    { moduleId: mod1._id, title: 'Async / Await Deep Dive',    type: 'article', article: '# Async/Await\nAsync functions return promises...', duration: 20, order: 3 },
    { moduleId: mod1._id, title: 'ES6+ Features Practice',     type: 'code',    code: 'const nums = [1,2,3];\nconsole.log(nums.map(n => n * 2));', duration: 15, order: 4 },
    { moduleId: mod2._id, title: 'Setting Up Express Server',  type: 'video',   videoUrl: 'https://example.com/l5', duration: 35, order: 1, isFree: true  },
    { moduleId: mod2._id, title: 'REST API Design Patterns',   type: 'article', article: '# REST API Patterns\nUse nouns for endpoints...', duration: 25, order: 2 },
    { moduleId: mod3._id, title: 'Components and Props',       type: 'video',   videoUrl: 'https://example.com/l7', duration: 28, order: 1, isFree: true  },
    { moduleId: mod3._id, title: 'useState and useEffect',     type: 'video',   videoUrl: 'https://example.com/l8', duration: 32, order: 2 },
    { moduleId: mod3._id, title: 'Custom Hooks',               type: 'code',    code: 'function useDebounce(val, delay) { ... }', duration: 20, order: 3 },
  ]);

  // Link lessons to modules
  await Module.findByIdAndUpdate(mod1._id, { lessons: lessons.slice(0, 4).map(l => l._id) });
  await Module.findByIdAndUpdate(mod2._id, { lessons: lessons.slice(4, 6).map(l => l._id) });
  await Module.findByIdAndUpdate(mod3._id, { lessons: lessons.slice(6, 9).map(l => l._id) });
  await LearningPath.findByIdAndUpdate(paths[0]._id, { modules: [mod1._id, mod2._id] });
  await LearningPath.findByIdAndUpdate(paths[2]._id, { modules: [mod3._id] });
  console.log(`✓ Seeded ${lessons.length} lessons across 3 modules`);

  // ── 5. Sandbox Projects ───────────────────────────────────────────────────
  const projects = await SandboxProject.insertMany([
    {
      title: 'Build a REST API with Node.js & Express',
      slug: 'build-rest-api-nodejs-express-' + Date.now(),
      description: 'Step-by-step project to build a fully authenticated REST API with JWT, file uploads, and MongoDB.',
      difficulty: 'intermediate', category: 'backend',
      technologyStack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      estimatedDuration: '6 Hours', estimatedMinutes: 360,
      instructor: sarah._id, isPublished: true, status: 'published',
      stepCount: 5, enrolledCount: 142,
    },
    {
      title: 'React Dashboard with Charts',
      slug: 'react-dashboard-charts-' + (Date.now() + 1),
      description: 'Build a responsive analytics dashboard using React, Recharts, and Tailwind CSS.',
      difficulty: 'intermediate', category: 'frontend',
      technologyStack: ['React', 'Recharts', 'Tailwind CSS'],
      estimatedDuration: '4 Hours', estimatedMinutes: 240,
      instructor: sarah._id, isPublished: true, status: 'published',
      stepCount: 4, enrolledCount: 98,
    },
    {
      title: 'Python Data Pipeline with Pandas',
      slug: 'python-data-pipeline-pandas-' + (Date.now() + 2),
      description: 'Ingest, clean, transform, and visualize real-world datasets using Python and pandas.',
      difficulty: 'advanced', category: 'ai_ml',
      technologyStack: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
      estimatedDuration: '8 Hours', estimatedMinutes: 480,
      instructor: james._id, isPublished: true, status: 'published',
      stepCount: 6, enrolledCount: 76,
    },
    {
      title: 'Core Java & Spring Boot Microservices',
      slug: 'core-java-spring-boot-microservices-' + (Date.now() + 3),
      description: 'Master Core Java fundamentals, Object-Oriented Programming, Spring Boot REST APIs, and microservices architecture.',
      difficulty: 'beginner', category: 'backend',
      technologyStack: ['Java', 'Spring Boot', 'Maven', 'MySQL'],
      estimatedDuration: '10 Hours', estimatedMinutes: 600,
      instructor: james._id, isPublished: true, status: 'published',
      stepCount: 5, enrolledCount: 115,
    },
  ]);

  // Sandbox Steps for project 1
  await SandboxStep.insertMany([
    { projectId: projects[0]._id, stepNumber: 1, title: 'Project Setup & Dependencies', estimatedTime: '30 min', description: 'Initialise the Node project, install express, mongoose, dotenv, bcryptjs and jsonwebtoken.', objectives: ['Create package.json', 'Install all dependencies', 'Setup folder structure'] },
    { projectId: projects[0]._id, stepNumber: 2, title: 'Database Connection & User Model', estimatedTime: '45 min', description: 'Connect to MongoDB and define the User schema with validation.', objectives: ['Connect mongoose', 'Define User model', 'Test connection'] },
    { projectId: projects[0]._id, stepNumber: 3, title: 'Auth Routes — Register & Login', estimatedTime: '60 min', description: 'Build POST /register and POST /login with password hashing and JWT generation.', objectives: ['Hash password with bcrypt', 'Generate JWT on login', 'Return token to client'] },
    { projectId: projects[0]._id, stepNumber: 4, title: 'Protected Routes & Middleware', estimatedTime: '45 min', description: 'Create auth middleware to verify JWT on protected endpoints.', objectives: ['Write protect middleware', 'Attach user to req', 'Test with Postman'] },
    { projectId: projects[0]._id, stepNumber: 5, title: 'File Upload with Multer', estimatedTime: '60 min', description: 'Add avatar upload endpoint using multer and serve static files.', objectives: ['Configure multer', 'Save files to /uploads', 'Return file URL in response'] },
  ]);
  console.log(`✓ Seeded ${projects.length} sandbox projects with steps`);

  // ── 6. Communities & Posts ────────────────────────────────────────────────
  const communities = await Community.insertMany([
    {
      name: 'JavaScript Developers',
      description: 'Everything about JavaScript — tips, projects, code reviews, and help.',
      category: 'Programming', tags: ['javascript', 'node', 'react'],
      owner: sarah._id, members: [sarah._id],
      moderators: [sarah._id], memberCount: 1, visibility: 'public', status: 'active',
    },
    {
      name: 'Data Science & ML',
      description: 'Python, machine learning, data pipelines, and research papers.',
      category: 'Data Science', tags: ['python', 'ml', 'pandas', 'tensorflow'],
      owner: james._id, members: [james._id],
      moderators: [james._id], memberCount: 1, visibility: 'public', status: 'active',
    },
    {
      name: 'CodeSphere General',
      description: 'General discussion, announcements, and platform feedback.',
      category: 'General', tags: ['general', 'help', 'announcements'],
      owner: admin._id, members: [admin._id],
      moderators: [admin._id], memberCount: 1, visibility: 'public', status: 'active',
    },
  ]);

  const posts = await Post.insertMany([
    {
      communityId: communities[0]._id, author: sarah._id,
      title: 'Why you should learn async/await properly',
      content: 'Many developers use async/await without understanding the underlying Promise chain. Here\'s a deep dive into how it actually works under the hood...',
      likeCount: 24, commentCount: 8, views: 120, isPinned: true,
      likes: [vikas._id, priya._id],
    },
    {
      communityId: communities[0]._id, author: vikas._id,
      title: 'Help: useEffect running twice in React 18',
      content: 'I\'m getting my useEffect running twice in development mode. I know it\'s because of StrictMode but how do I handle cleanup properly? Here\'s my code...',
      likeCount: 8, commentCount: 12, views: 65,
    },
    {
      communityId: communities[1]._id, author: james._id,
      title: 'Building a real-time data pipeline with Python',
      content: 'In this post I\'ll walk through building a streaming data pipeline using Kafka, Python consumers, and storing results in MongoDB...',
      likeCount: 31, commentCount: 15, views: 180, isPinned: true,
      likes: [vikas._id, priya._id, alex._id],
    },
    {
      communityId: communities[2]._id, author: admin._id,
      title: 'Welcome to CodeSphere!',
      content: 'Welcome everyone! This is the official community for all CodeSphere users. Feel free to ask questions, share projects, and connect with other learners.',
      likeCount: 45, commentCount: 22, views: 300, isPinned: true,
      likes: users.map(u => u._id),
    },
  ]);

  await Community.findByIdAndUpdate(communities[0]._id, { postCount: 2 });
  await Community.findByIdAndUpdate(communities[1]._id, { postCount: 1 });
  await Community.findByIdAndUpdate(communities[2]._id, { postCount: 1 });
  console.log(`✓ Seeded ${communities.length} communities with ${posts.length} posts`);

  // ── 7. Event Categories & Events ──────────────────────────────────────────
  const eventCats = await EventCategory.insertMany([
    { name: 'Hackathon', icon: 'trophy',    color: '#3b82f6', eventCount: 2 },
    { name: 'Workshop',  icon: 'tool',      color: '#10b981', eventCount: 2 },
    { name: 'Webinar',   icon: 'video',     color: '#8b5cf6', eventCount: 1 },
    { name: 'Contest',   icon: 'zap',       color: '#f59e0b', eventCount: 1 },
  ]);

  const now = new Date();
  const events = await Event.insertMany([
    {
      title: 'National CodeSphere Hackathon 2026',
      slug: 'national-codesphere-hackathon-2026-' + Date.now(),
      description: 'Build an innovative web app in 48 hours. Top 3 teams win cash prizes and cloud credits.',
      eventType: 'hackathon', mode: 'online', difficulty: 'intermediate',
      organizer: sarah._id, category: eventCats[0]._id,
      country: 'United States', city: 'San Francisco', latitude: 37.7749, longitude: -122.4194,
      startDate: new Date(now.getTime() + 7 * 86400000),
      endDate:   new Date(now.getTime() + 9 * 86400000),
      registrationDeadline: new Date(now.getTime() + 5 * 86400000),
      maxParticipants: 200, registeredParticipants: 84,
      prizePool: '₹50,000 + AWS Credits', entryFee: 0,
      status: 'registration_open', isPublished: true, source: 'internal',
      tags: ['hackathon', 'web', 'open-source'],
    },
    {
      title: 'React Performance Workshop',
      slug: 'react-performance-workshop-' + (Date.now() + 1),
      description: 'Hands-on workshop on profiling, memoization, code splitting, and bundle optimization.',
      eventType: 'workshop', mode: 'online', difficulty: 'advanced',
      organizer: sarah._id, category: eventCats[1]._id,
      country: 'United Kingdom', city: 'London', latitude: 51.5074, longitude: -0.1278,
      startDate: new Date(now.getTime() + 3 * 86400000),
      endDate:   new Date(now.getTime() + 3 * 86400000 + 7200000),
      registrationDeadline: new Date(now.getTime() + 2 * 86400000),
      maxParticipants: 50, registeredParticipants: 38,
      entryFee: 0, status: 'registration_open', isPublished: true, source: 'internal',
      tags: ['react', 'performance', 'workshop'],
    },
    {
      title: 'Python for Data Science — Live Webinar',
      slug: 'python-data-science-webinar-' + (Date.now() + 2),
      description: 'Introduction to pandas, NumPy, and Matplotlib. Build your first data analysis project live.',
      eventType: 'webinar', mode: 'online', difficulty: 'beginner',
      organizer: james._id, category: eventCats[2]._id,
      country: 'India', city: 'Bengaluru', latitude: 12.9716, longitude: 77.5946,
      startDate: new Date(now.getTime() + 1 * 86400000),
      endDate:   new Date(now.getTime() + 1 * 86400000 + 5400000),
      registrationDeadline: new Date(now.getTime() + 86000000),
      maxParticipants: 300, registeredParticipants: 211,
      entryFee: 0, status: 'upcoming', isPublished: true, source: 'internal',
      tags: ['python', 'data', 'beginners'],
    },
    {
      title: 'JavaScript Coding Contest — July Edition',
      slug: 'javascript-coding-contest-july-' + (Date.now() + 3),
      description: 'Solve 5 algorithmic problems in 90 minutes. Rated contest — win certificates and XP points.',
      eventType: 'coding_contest', mode: 'online', difficulty: 'intermediate',
      organizer: admin._id, category: eventCats[3]._id,
      country: 'Japan', city: 'Tokyo', latitude: 35.6762, longitude: 139.6503,
      startDate: new Date(now.getTime() + 14 * 86400000),
      endDate:   new Date(now.getTime() + 14 * 86400000 + 5400000),
      registrationDeadline: new Date(now.getTime() + 12 * 86400000),
      maxParticipants: 500, registeredParticipants: 127,
      entryFee: 0, status: 'registration_open', isPublished: true, source: 'internal',
      tags: ['javascript', 'algorithms', 'contest'],
    },
  ]);
  console.log(`✓ Seeded ${eventCats.length} event categories and ${events.length} events`);

  // ── 8. Tests & Questions ──────────────────────────────────────────────────
  const tests = await Test.insertMany([
    {
      title: 'JavaScript Fundamentals Assessment',
      slug: 'js-fundamentals-assessment-' + Date.now(),
      description: 'Test your core JavaScript knowledge — closures, promises, prototypes, and ES6+.',
      difficulty: 'intermediate', technology: 'JavaScript',
      duration: 45, passingMarks: 14, totalMarks: 20,
      totalQuestions: 5, maxAttempts: 2,
      shuffleQuestions: true, shuffleOptions: true,
      instructor: sarah._id, isPublished: true, status: 'published',
      attemptCount: 68, averageScore: 72,
      tags: ['javascript', 'es6', 'fundamentals'],
    },
    {
      title: 'Python Data Structures Quiz',
      slug: 'python-data-structures-quiz-' + (Date.now() + 1),
      description: 'Lists, dicts, sets, tuples — test your Python data structure knowledge.',
      difficulty: 'beginner', technology: 'Python',
      duration: 30, passingMarks: 8, totalMarks: 10,
      totalQuestions: 3, maxAttempts: 3,
      instructor: james._id, isPublished: true, status: 'published',
      attemptCount: 45, averageScore: 78,
      tags: ['python', 'data-structures'],
    },
    {
      title: 'React Hooks Deep Dive',
      slug: 'react-hooks-deep-dive-' + (Date.now() + 2),
      description: 'useState, useEffect, useCallback, useMemo, useRef — 10 questions, 20 minutes.',
      difficulty: 'advanced', technology: 'React',
      duration: 20, passingMarks: 7, totalMarks: 10,
      totalQuestions: 3, maxAttempts: 1,
      instructor: sarah._id, isPublished: true, status: 'published',
      attemptCount: 33, averageScore: 65,
      tags: ['react', 'hooks'],
    },
  ]);

  await Question.insertMany([
    // Test 1 — JavaScript
    { testId: tests[0]._id, questionTitle: 'What is the output of typeof null?', questionType: 'mcq', options: ['"null"', '"object"', '"undefined"', '"boolean"'], correctAnswer: '"object"', marks: 4, difficulty: 'intermediate', orderIndex: 1, explanation: 'typeof null returns "object" due to a historical JavaScript bug.' },
    { testId: tests[0]._id, questionTitle: 'Which method is used to merge two arrays in ES6?', questionType: 'mcq', options: ['concat()', 'spread (...)', 'Both A and B', 'join()'], correctAnswer: 'Both A and B', marks: 4, difficulty: 'beginner', orderIndex: 2 },
    { testId: tests[0]._id, questionTitle: 'What does the Promise.all() method do?', questionType: 'mcq', options: ['Resolves when first promise resolves', 'Resolves when all promises resolve', 'Rejects all promises', 'Cancels all promises'], correctAnswer: 'Resolves when all promises resolve', marks: 4, difficulty: 'intermediate', orderIndex: 3 },
    { testId: tests[0]._id, questionTitle: 'Explain what a closure is in JavaScript.', questionType: 'short_answer', correctAnswer: 'A closure is a function that retains access to its outer scope even after the outer function has returned.', marks: 4, difficulty: 'advanced', orderIndex: 4 },
    { testId: tests[0]._id, questionTitle: 'var declarations are block-scoped.', questionType: 'true_false', options: ['True', 'False'], correctAnswer: 'False', marks: 4, difficulty: 'beginner', orderIndex: 5 },
    // Test 2 — Python
    { testId: tests[1]._id, questionTitle: 'Which Python data structure does not allow duplicate values?', questionType: 'mcq', options: ['list', 'tuple', 'set', 'dict'], correctAnswer: 'set', marks: 4, difficulty: 'beginner', orderIndex: 1 },
    { testId: tests[1]._id, questionTitle: 'How do you access the last element of a Python list?', questionType: 'mcq', options: ['list[last]', 'list[-1]', 'list.last()', 'list.end()'], correctAnswer: 'list[-1]', marks: 3, difficulty: 'beginner', orderIndex: 2 },
    { testId: tests[1]._id, questionTitle: 'Dictionaries in Python maintain insertion order (Python 3.7+).', questionType: 'true_false', options: ['True', 'False'], correctAnswer: 'True', marks: 3, difficulty: 'beginner', orderIndex: 3 },
    // Test 3 — React
    { testId: tests[2]._id, questionTitle: 'Which hook should you use to avoid re-creating a function on every render?', questionType: 'mcq', options: ['useState', 'useCallback', 'useMemo', 'useRef'], correctAnswer: 'useCallback', marks: 4, difficulty: 'advanced', orderIndex: 1 },
    { testId: tests[2]._id, questionTitle: 'What does the second argument of useEffect control?', questionType: 'mcq', options: ['The return value', 'The dependency array (when effect re-runs)', 'The component key', 'Error boundary'], correctAnswer: 'The dependency array (when effect re-runs)', marks: 3, difficulty: 'intermediate', orderIndex: 2 },
    { testId: tests[2]._id, questionTitle: 'useRef triggers a re-render when its .current value changes.', questionType: 'true_false', options: ['True', 'False'], correctAnswer: 'False', marks: 3, difficulty: 'intermediate', orderIndex: 3 },
  ]);
  console.log(`✓ Seeded ${tests.length} tests with questions`);

  // ── 9. Resources ──────────────────────────────────────────────────────────
  const ResourceCategory = mongoose.models.ResourceCategory || require('./models/ResourceCategory');
  const resCats = await ResourceCategory.insertMany([
    { name: 'Full Stack & Web Dev', slug: 'fullstack',       icon: 'code',     color: '#04AA6D', resourceCount: 5 },
    { name: 'DSA & Algorithms',     slug: 'dsa',             icon: 'terminal', color: '#3b82f6', resourceCount: 4 },
    { name: 'AI, ML & Data Science', slug: 'ai',              icon: 'sparkles', color: '#8b5cf6', resourceCount: 3 },
    { name: 'System Design',        slug: 'system_design',   icon: 'cpu',      color: '#f59e0b', resourceCount: 2 },
    { name: 'Cloud & DevOps',       slug: 'cloud',           icon: 'globe',    color: '#06b6d4', resourceCount: 3 },
    { name: 'Cyber Security',       slug: 'cybersecurity',   icon: 'shield',   color: '#ef4444', resourceCount: 2 },
    { name: 'Interview & Placement',slug: 'placements',      icon: 'trophy',   color: '#ec4899', resourceCount: 1 },
    { name: 'General CS',           slug: 'general-cs',      icon: 'book',     color: '#6366f1', resourceCount: 1 },
  ]);

  await Resource.insertMany([
    // Full Stack & Web Dev
    {
      title: 'JavaScript ES6+ Cheatsheet',
      description: 'Complete reference for arrow functions, destructuring, spread/rest, modules, promises, and async/await.',
      resourceType: 'pdf', category: resCats[0]._id, difficulty: 'beginner', language: 'English',
      externalUrl: 'https://example.com/js-es6-cheatsheet.pdf', uploadedBy: sarah._id, status: 'published',
      views: 540, downloadsCount: 280, averageRating: 4.9, isFeatured: true, isTrending: true,
      tags: ['javascript', 'es6', 'cheatsheet', 'fullstack'],
    },
    {
      title: 'Node.js Event Loop Architecture Guide',
      description: 'Detailed article with diagrams explaining the Node.js event loop, call stack, microtasks, and task queues.',
      resourceType: 'documentation', category: resCats[0]._id, difficulty: 'intermediate', language: 'English',
      externalUrl: 'https://example.com/nodejs-event-loop', uploadedBy: sarah._id, status: 'published',
      views: 420, downloadsCount: 190, averageRating: 4.8, isFeatured: true,
      tags: ['nodejs', 'event-loop', 'async', 'fullstack'],
    },
    {
      title: 'React 19 & Next.js App Router Masterclass Notes',
      description: 'Deep dive into Server Components, Server Actions, Suspense boundaries, streaming, and state management in React 19.',
      resourceType: 'pdf', category: resCats[0]._id, difficulty: 'advanced', language: 'English',
      externalUrl: 'https://example.com/react-19-nextjs-guide.pdf', uploadedBy: sarah._id, status: 'published',
      views: 680, downloadsCount: 340, averageRating: 4.9, isFeatured: true, isTrending: true,
      tags: ['react', 'nextjs', 'frontend', 'fullstack'],
    },
    {
      title: 'Full-Stack MERN Starter & Auth Template',
      description: 'Complete production-ready starter template with JWT authentication, RBAC, file upload, and MongoDB Mongoose models.',
      resourceType: 'source_code', category: resCats[0]._id, difficulty: 'intermediate', language: 'English',
      externalUrl: 'https://github.com/example/mern-starter', uploadedBy: sarah._id, status: 'published',
      views: 390, downloadsCount: 210, averageRating: 4.8,
      tags: ['mern', 'react', 'nodejs', 'mongodb', 'starter', 'fullstack'],
    },
    {
      title: 'CSS Grid & Flexbox Visual Cheat Sheet',
      description: 'Quick visual reference for grid layout, flex directions, alignment, positioning, and responsive design patterns.',
      resourceType: 'notes', category: resCats[0]._id, difficulty: 'beginner', language: 'English',
      externalUrl: 'https://example.com/css-grid-flexbox.pdf', uploadedBy: sarah._id, status: 'published',
      views: 310, downloadsCount: 145, averageRating: 4.7,
      tags: ['css', 'frontend', 'flexbox', 'layout', 'fullstack'],
    },

    // DSA & Algorithms
    {
      title: 'Big-O Complexity & Data Structures Cheatsheet',
      description: 'Time and space complexity tables for array, linked list, tree, graph, sorting algorithms, and hash tables.',
      resourceType: 'pdf', category: resCats[1]._id, difficulty: 'beginner', language: 'English',
      externalUrl: 'https://example.com/big-o-cheatsheet.pdf', uploadedBy: james._id, status: 'published',
      views: 920, downloadsCount: 510, averageRating: 4.9, isFeatured: true, isTrending: true,
      tags: ['algorithms', 'dsa', 'big-o', 'data-structures'],
    },
    {
      title: 'Blind 75 LeetCode Pattern Guide',
      description: 'Comprehensive breakdown of the Blind 75 LeetCode questions categorized by pattern: Two Pointers, Sliding Window, Graphs, DP.',
      resourceType: 'pdf', category: resCats[1]._id, difficulty: 'intermediate', language: 'English',
      externalUrl: 'https://example.com/blind-75-patterns.pdf', uploadedBy: james._id, status: 'published',
      views: 850, downloadsCount: 460, averageRating: 4.9, isFeatured: true, isTrending: true,
      tags: ['dsa', 'leetcode', 'algorithms', 'interview'],
    },
    {
      title: 'Dynamic Programming & Backtracking Framework',
      description: 'Step-by-step framework to identify subproblems, state transitions, memoization, and bottom-up DP table construction.',
      resourceType: 'documentation', category: resCats[1]._id, difficulty: 'advanced', language: 'English',
      externalUrl: 'https://example.com/dp-framework-guide', uploadedBy: james._id, status: 'published',
      views: 390, downloadsCount: 180, averageRating: 4.8,
      tags: ['dp', 'algorithms', 'backtracking', 'dsa'],
    },
    {
      title: 'Graph Algorithms & Tree Traversals Handbook',
      description: 'BFS, DFS, Dijkstra, Topological Sort, and Union-Find algorithms implementation in Python and JavaScript.',
      resourceType: 'notes', category: resCats[1]._id, difficulty: 'intermediate', language: 'English',
      externalUrl: 'https://example.com/graph-algorithms.pdf', uploadedBy: james._id, status: 'published',
      views: 290, downloadsCount: 135, averageRating: 4.7,
      tags: ['graph', 'bfs', 'dfs', 'algorithms', 'dsa'],
    },

    // AI, ML & Data Science
    {
      title: 'Python Pandas & NumPy Complete Reference',
      description: 'From DataFrames to groupby, merge, pivot tables, and time series — a comprehensive data science reference.',
      resourceType: 'pdf', category: resCats[2]._id, difficulty: 'intermediate', language: 'English',
      externalUrl: 'https://example.com/pandas-guide.pdf', uploadedBy: james._id, status: 'published',
      views: 480, downloadsCount: 260, averageRating: 4.8, isFeatured: true,
      tags: ['python', 'pandas', 'numpy', 'data-science', 'ai'],
    },
    {
      title: 'PyTorch & Deep Learning Foundations',
      description: 'Tensors, autograd, neural network modules, loss functions, optimizers, and CNN/Transformer architectures in PyTorch.',
      resourceType: 'pdf', category: resCats[2]._id, difficulty: 'advanced', language: 'English',
      externalUrl: 'https://example.com/pytorch-foundations.pdf', uploadedBy: james._id, status: 'published',
      views: 560, downloadsCount: 290, averageRating: 4.9, isFeatured: true, isTrending: true,
      tags: ['pytorch', 'deep-learning', 'ai', 'machine-learning'],
    },
    {
      title: 'LangChain & RAG AI Boilerplate',
      description: 'Production-ready Retrieval-Augmented Generation pipeline using LangChain, OpenAI API, and Pinecone vector store.',
      resourceType: 'source_code', category: resCats[2]._id, difficulty: 'intermediate', language: 'English',
      externalUrl: 'https://github.com/example/langchain-rag', uploadedBy: james._id, status: 'published',
      views: 620, downloadsCount: 310, averageRating: 4.9, isFeatured: true, isTrending: true,
      tags: ['ai', 'langchain', 'openai', 'rag', 'llm'],
    },

    // System Design
    {
      title: 'System Design Interview Architecture Guide',
      description: 'High-availability architecture patterns: Load balancers, API gateways, database sharding, caching, message queues, and CAP theorem.',
      resourceType: 'pdf', category: resCats[3]._id, difficulty: 'advanced', language: 'English',
      externalUrl: 'https://example.com/system-design-guide.pdf', uploadedBy: sarah._id, status: 'published',
      views: 980, downloadsCount: 580, averageRating: 4.9, isFeatured: true, isTrending: true,
      tags: ['system-design', 'microservices', 'architecture', 'scaling'],
    },
    {
      title: 'Distributed Caching with Redis & Kafka Event Streaming',
      description: 'Deep dive into cache invalidation strategies, pub/sub messaging, Kafka consumer groups, and event-driven microservices.',
      resourceType: 'documentation', category: resCats[3]._id, difficulty: 'advanced', language: 'English',
      externalUrl: 'https://example.com/redis-kafka-guide', uploadedBy: sarah._id, status: 'published',
      views: 440, downloadsCount: 220, averageRating: 4.8,
      tags: ['redis', 'kafka', 'system-design', 'event-driven'],
    },

    // Cloud & DevOps
    {
      title: 'Docker & Containerization Master Class Notes',
      description: 'Dockerfile best practices, multi-stage builds, Docker Compose configurations, and container security hardening.',
      resourceType: 'pdf', category: resCats[4]._id, difficulty: 'intermediate', language: 'English',
      externalUrl: 'https://example.com/docker-masterclass.pdf', uploadedBy: vikas._id, status: 'published',
      views: 610, downloadsCount: 330, averageRating: 4.9, isFeatured: true,
      tags: ['docker', 'devops', 'containers', 'cloud'],
    },
    {
      title: 'Kubernetes Cluster Administration & YAML Reference',
      description: 'Deployments, Services, Ingress controllers, ConfigMaps, Secrets, Helm charts, and HPA autoscaling configs.',
      resourceType: 'notes', category: resCats[4]._id, difficulty: 'advanced', language: 'English',
      externalUrl: 'https://example.com/k8s-yaml-ref.pdf', uploadedBy: vikas._id, status: 'published',
      views: 470, downloadsCount: 240, averageRating: 4.8,
      tags: ['kubernetes', 'devops', 'cloud', 'k8s'],
    },
    {
      title: 'AWS Cloud Solutions Architect Quick Ref',
      description: 'EC2, S3, RDS, Lambda, VPC networking, IAM policies, and CloudWatch monitoring cheat sheet.',
      resourceType: 'pdf', category: resCats[4]._id, difficulty: 'intermediate', language: 'English',
      externalUrl: 'https://example.com/aws-quick-ref.pdf', uploadedBy: vikas._id, status: 'published',
      views: 520, downloadsCount: 270, averageRating: 4.8,
      tags: ['aws', 'cloud', 'devops', 'architecture'],
    },

    // Cyber Security
    {
      title: 'OWASP Top 10 Web Security Cheat Sheet',
      description: 'How to prevent SQL injection, XSS, CSRF, broken authentication, SSRF, and sensitive data exposure in modern web apps.',
      resourceType: 'pdf', category: resCats[5]._id, difficulty: 'intermediate', language: 'English',
      externalUrl: 'https://example.com/owasp-top-10.pdf', uploadedBy: sarah._id, status: 'published',
      views: 410, downloadsCount: 205, averageRating: 4.9, isFeatured: true,
      tags: ['security', 'owasp', 'cybersecurity', 'web-dev'],
    },
    {
      title: 'Network Security & Cryptography Essentials',
      description: 'Symmetric & asymmetric encryption, SSL/TLS handshakes, JWT tokens, OAuth 2.0 flows, and CORS configurations explained.',
      resourceType: 'documentation', category: resCats[5]._id, difficulty: 'intermediate', language: 'English',
      externalUrl: 'https://example.com/network-security.pdf', uploadedBy: sarah._id, status: 'published',
      views: 330, downloadsCount: 160, averageRating: 4.7,
      tags: ['security', 'cryptography', 'jwt', 'oauth', 'cybersecurity'],
    },

    // Interview & Placement
    {
      title: 'Software Engineer Tech Interview Playbook',
      description: 'Complete placement preparation kit: Behavioral STAR method questions, resume templates, system design frameworks, and HR prep.',
      resourceType: 'pdf', category: resCats[6]._id, difficulty: 'beginner', language: 'English',
      externalUrl: 'https://example.com/tech-interview-playbook.pdf', uploadedBy: sarah._id, status: 'published',
      views: 890, downloadsCount: 520, averageRating: 4.9, isFeatured: true, isTrending: true,
      tags: ['interview', 'placement', 'career', 'resume', 'placements'],
    },

    // General CS
    {
      title: 'SQL Database Optimization & Indexing Guide',
      description: 'B-Trees, composite indexes, query execution plans, transactions, ACID properties, and database normalization rules.',
      resourceType: 'notes', category: resCats[7]._id, difficulty: 'intermediate', language: 'English',
      externalUrl: 'https://example.com/sql-optimization.pdf', uploadedBy: james._id, status: 'published',
      views: 370, downloadsCount: 195, averageRating: 4.8,
      tags: ['sql', 'database', 'postgresql', 'indexing', 'general-cs'],
    },
  ]);
  console.log('✓ Seeded 8 resource categories and 21 developer resources');

  // ── 10. Workspaces ────────────────────────────────────────────────────────
  await Workspace.insertMany([
    {
      name: 'E-commerce Platform', slug: 'ecommerce-platform-' + Date.now(),
      owner: vikas._id,
      description: 'Full-stack e-commerce app with Node.js backend and React frontend.',
      visibility: 'private', status: 'active',
      technologyStack: ['Node.js', 'React', 'MongoDB', 'Stripe'],
      githubRepo: 'https://github.com/vikasreddy/ecommerce',
      tags: ['fullstack', 'ecommerce'], memberCount: 2, taskCount: 8,
    },
    {
      name: 'ML Price Predictor', slug: 'ml-price-predictor-' + (Date.now() + 1),
      owner: priya._id,
      description: 'Housing price prediction model using scikit-learn and Flask API.',
      visibility: 'public', status: 'active',
      technologyStack: ['Python', 'scikit-learn', 'Flask', 'Pandas'],
      tags: ['ml', 'python', 'api'], memberCount: 1, taskCount: 5,
    },
    {
      name: 'CodeSphere Open Source', slug: 'codesphere-open-source-' + (Date.now() + 2),
      owner: admin._id,
      description: 'Community-driven contributions to CodeSphere platform features.',
      visibility: 'public', status: 'active',
      technologyStack: ['React', 'Node.js', 'MongoDB'],
      tags: ['opensource', 'community'], memberCount: 4, taskCount: 12,
    },
  ]);
  console.log('✓ Seeded 3 workspaces');

  // ── 11. Notifications ─────────────────────────────────────────────────────
  await Notification.insertMany([
    {
      recipient: vikas._id, title: 'New session available',
      message: 'Sarah Chen has scheduled a new live session: React Performance Workshop. Register now!',
      category: 'Live Session', type: 'Information', priority: 'Medium', status: 'Unread',
    },
    {
      recipient: vikas._id, title: 'Assessment results ready',
      message: 'Your JavaScript Fundamentals test results are now available. You scored 76%!',
      category: 'Assessment', type: 'Success', priority: 'High', status: 'Unread',
    },
    {
      recipient: vikas._id, title: 'Hackathon registration open',
      message: 'National CodeSphere Hackathon 2026 registration is now open. Closes in 5 days.',
      category: 'Event', type: 'Reminder', priority: 'High', status: 'Unread',
    },
    {
      recipient: vikas._id, title: 'Welcome to CodeSphere!',
      message: 'Your account is all set up. Start with a learning path or browse the sandbox projects.',
      category: 'System', type: 'Information', priority: 'Low', status: 'Read',
      readAt: new Date(),
    },
    {
      recipient: priya._id, title: 'Community post liked',
      message: 'Sarah Chen liked your post "Help: useEffect running twice in React 18".',
      category: 'Community', type: 'Information', priority: 'Low', status: 'Unread',
    },
    {
      recipient: sarah._id, title: 'New student enrolled',
      message: 'Vikas Reddy enrolled in your course "Full-Stack JavaScript Development".',
      category: 'Learning', type: 'Success', priority: 'Medium', status: 'Unread',
    },
  ]);
  console.log('✓ Seeded 6 notifications');

  // ── 12. Summary ───────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  Seed complete! Here\'s what was added:\n');
  console.log('  Users (6)');
  console.log('    student    → vikas@example.com       / Password123!');
  console.log('    student    → priya@example.com       / Password123!');
  console.log('    student    → alex@example.com        / Password123!');
  console.log('    instructor → instructor@gmail.com    / instructor123');
  console.log('    instructor → instructor2@gmail.com   / instructor123');
  console.log('    admin      → admin@codesphere.dev    / admin123');
  console.log('');
  console.log('  Learning Paths (4) with Modules (3) and Lessons (9)');
  console.log('  Sandbox Projects (3) with Steps (5)');
  console.log('  Communities (3) with Posts (4)');
  console.log('  Event Categories (4) and Events (4)');
  console.log('  Tests (3) with Questions (11)');
  console.log('  Resource Categories (4) and Resources (5)');
  console.log('  Subscription Plans (3): free / standard / premium');
  console.log('  Workspaces (3)');
  console.log('  Notifications (6)');
  console.log('═══════════════════════════════════════════════════\n');

  if (require.main === module) {
    await mongoose.disconnect();
    process.exit(0);
  }
}

if (require.main === module) {
  seed().catch((err) => {
    console.error('\n✗ Seed failed:', err.message);
    console.error(err);
    mongoose.disconnect();
    process.exit(1);
  });
} else {
  module.exports = seed;
}
