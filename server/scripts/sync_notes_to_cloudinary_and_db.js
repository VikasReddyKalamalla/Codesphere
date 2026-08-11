require('dotenv').config({ path: __dirname + '/../.env' });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const connectDB = require('../config/db');
const Resource = require('../models/Resource');
const ResourceCategory = require('../models/ResourceCategory');
const User = require('../models/User');

const NOTES_METADATA = {
  'CSS_Complete_Notes.pdf': {
    title: 'CSS3 Complete Master Notes & Cheat Sheet',
    description: 'Master Cascading Style Sheets (CSS3) from basic selectors, box model, and Flexbox/Grid layouts to keyframe animations and responsive design.',
    categoryName: 'Full Stack & Web Dev',
    difficulty: 'beginner',
    tags: ['css', 'css3', 'frontend', 'web-dev', 'cheatsheet', 'notes'],
  },
  'DSA_CompleteNotes.pdf': {
    title: 'DSA Complete Notes & Algorithms Handbook',
    description: 'Comprehensive Data Structures & Algorithms handbook covering Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting, DP, and LeetCode patterns.',
    categoryName: 'DSA & Algorithms',
    difficulty: 'intermediate',
    tags: ['dsa', 'algorithms', 'data-structures', 'leetcode', 'cpp', 'notes'],
  },
  'Flask Cheatsheet.pdf': {
    title: 'Flask Web Framework Complete Cheatsheet',
    description: 'Quick reference for Python Flask micro-framework: routing, request handling, Jinja2 templating, ORM database integration, and REST APIs.',
    categoryName: 'AI, ML & Data Science',
    difficulty: 'beginner',
    tags: ['python', 'flask', 'backend', 'cheatsheet', 'api', 'notes'],
  },
  'HTML_Complete_Notes.pdf': {
    title: 'HTML5 Complete Handbook & Reference',
    description: 'Essential HTML5 fundamentals, semantic elements, form controls, web accessibility (a11y), canvas, media tags, and document structure.',
    categoryName: 'Full Stack & Web Dev',
    difficulty: 'beginner',
    tags: ['html', 'html5', 'web-dev', 'frontend', 'cheatsheet', 'notes'],
  },
  'JS_Chapterwise_Notes.pdf': {
    title: 'JavaScript Chapterwise Complete Notes',
    description: 'In-depth JavaScript guide covering variables, DOM manipulation, ES6+ features, closures, prototypes, event loop, Promises, and async/await.',
    categoryName: 'Full Stack & Web Dev',
    difficulty: 'intermediate',
    tags: ['javascript', 'js', 'es6', 'frontend', 'web-dev', 'notes'],
  },
  'Java_Complete_Notes.pdf': {
    title: 'Java Complete Mastery Notes & Handbook',
    description: 'Complete Core Java reference covering Object-Oriented Programming (OOP), Multithreading, Collections Framework, JVM internals, and Exception Handling.',
    categoryName: 'General CS',
    difficulty: 'intermediate',
    tags: ['java', 'core-java', 'oop', 'backend', 'notes'],
  },
  'Php Cheatsheet.pdf': {
    title: 'PHP Backend Scripting Complete Cheatsheet',
    description: 'Essential PHP reference covering language syntax, array functions, superglobals, MySQLi/PDO database connections, and session management.',
    categoryName: 'Full Stack & Web Dev',
    difficulty: 'beginner',
    tags: ['php', 'backend', 'web-dev', 'mysql', 'cheatsheet', 'notes'],
  },
};

const syncNotesToCloudinaryAndDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB.');

    const SOURCE_DIR = path.join(__dirname, '../../notes(resources)');
    if (!fs.existsSync(SOURCE_DIR)) {
      console.error('❌ Notes directory not found at:', SOURCE_DIR);
      process.exit(1);
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.pdf'));
    console.log(`📁 Found ${files.length} PDF notes to process.`);

    // Find default uploader user (admin or instructor)
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.findOne({ role: 'instructor' });
    }
    if (!adminUser) {
      adminUser = await User.findOne({});
    }

    const uploadedResourcesList = [];

    const uploadPromise = (file, opts) => new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file, opts, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const MAX_CLOUDINARY_SIZE = 10 * 1024 * 1024; // 10MB Cloudinary Free Tier Limit

    for (const filename of files) {
      const filePath = path.join(SOURCE_DIR, filename);
      const fileStats = fs.statSync(filePath);
      const meta = NOTES_METADATA[filename] || {
        title: filename.replace('.pdf', '').replace(/_/g, ' '),
        description: `Complete notes and reference guide for ${filename.replace('.pdf', '')}.`,
        categoryName: 'Full Stack & Web Dev',
        difficulty: 'beginner',
        tags: ['notes', 'pdf', 'development'],
      };

      console.log(`\n📤 Processing "${filename}" (${(fileStats.size / 1024 / 1024).toFixed(2)} MB)...`);
      let fileUrl = '';
      let isCloudinary = false;

      if (fileStats.size <= MAX_CLOUDINARY_SIZE) {
        try {
          console.log(`   Attempting Cloudinary upload for ${filename}...`);
          const uploadResult = await uploadPromise(filePath, {
            folder: 'codesphere/notes',
            resource_type: 'auto',
          });
          if (uploadResult && (uploadResult.secure_url || uploadResult.url)) {
            fileUrl = uploadResult.secure_url || uploadResult.url;
            isCloudinary = true;
            console.log(`   ✅ Cloudinary Upload Success! URL: ${fileUrl}`);
          }
        } catch (err) {
          console.warn(`   ⚠️ Cloudinary upload skipped for ${filename}: ${err.message}`);
        }
      } else {
        console.log(`   ℹ️ File size exceeds Cloudinary free limit (10MB). Using direct CodeSphere server proxy.`);
      }

      if (!fileUrl) {
        fileUrl = `/mock-resources-proxy/${encodeURIComponent(filename)}`;
      }

      // Find category
      let category = await ResourceCategory.findOne({ name: meta.categoryName });
      if (!category) {
        category = await ResourceCategory.findOne({});
      }

      const resourceData = {
        title: meta.title,
        description: meta.description,
        thumbnail: fileUrl.startsWith('http') && fileUrl.endsWith('.pdf') ? fileUrl.replace(/\.pdf$/i, '.jpg') : '',
        category: category ? category._id : meta.categoryName,
        difficulty: meta.difficulty,
        tags: meta.tags,
        language: 'English',
        resourceType: 'pdf',
        fileUrl: fileUrl,
        externalUrl: fileUrl,
        uploadedBy: adminUser ? adminUser._id : new mongoose.Types.ObjectId(),
        instructor: 'CodeSphere Team',
        status: 'published',
        isFeatured: true,
        isTrending: true,
        views: Math.floor(Math.random() * 400) + 100,
        downloadsCount: Math.floor(Math.random() * 200) + 50,
        averageRating: 4.9,
      };

      // Upsert into MongoDB
      const updatedResource = await Resource.findOneAndUpdate(
        { title: meta.title },
        resourceData,
        { upsert: true, returnDocument: 'after', runValidators: true }
      );

      console.log(`   💾 Saved to MongoDB: "${updatedResource.title}" (ID: ${updatedResource._id})`);

      uploadedResourcesList.push({
        _id: updatedResource._id.toString(),
        title: meta.title,
        description: meta.description,
        category: meta.categoryName,
        difficulty: meta.difficulty,
        tags: meta.tags,
        resourceType: 'pdf',
        fileUrl: fileUrl,
        externalUrl: fileUrl,
        uploadedBy: { fullName: adminUser ? adminUser.fullName : 'CodeSphere Team', avatar: '' },
        views: updatedResource.views,
        downloadsCount: updatedResource.downloadsCount,
        averageRating: updatedResource.averageRating,
        createdAt: new Date(),
        status: 'published',
        isCloudinary,
      });
    }

    console.log('\n🎉 ALL NOTES INSTANTLY SYNCED AND SAVED TO DATABASE!');
    console.log(`Total Resources Processed: ${uploadedResourcesList.length}`);

    // Update mockResources.js so mock mode fallback also serves these Cloudinary links!
    const mockResourcesPath = path.join(__dirname, '../services/mockResources.js');
    const updatedMockCode = `const fs = require('fs');
const path = require('path');

const SEEDED_NOTES = ${JSON.stringify(uploadedResourcesList, null, 2)};

let mockResources = [];
let isMockSeeded = false;

const seedMockResources = () => {
  if (isMockSeeded) return mockResources;
  mockResources = SEEDED_NOTES;
  isMockSeeded = true;
  return mockResources;
};

module.exports = { seedMockResources };
`;

    fs.writeFileSync(mockResourcesPath, updatedMockCode, 'utf8');
    console.log('✅ Updated server/services/mockResources.js with updated URLs.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during sync:', err);
    process.exit(1);
  }
};

syncNotesToCloudinaryAndDB();
