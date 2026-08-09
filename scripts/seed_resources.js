const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const Resource = require('../server/models/Resource');
const User = require('../server/models/User');

const SOURCE_DIR = path.join(__dirname, '../notes(resources)');
const TARGET_DIR = path.join(__dirname, '../server/uploads/resources');

async function seedResources() {
  try {
    // 1. Connect DB
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected for seeding resources');

    // 2. Clear dummy data
    await Resource.deleteMany({});
    console.log('Deleted existing resources');

    // 3. Find admin
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin user found. Creating dummy admin...');
      throw new Error('Admin user is required to assign resources');
    }
    console.log(`Using admin user: ${admin.fullName} (${admin._id})`);

    // 4. Ensure target directory exists
    if (!fs.existsSync(TARGET_DIR)) {
      fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    // 5. Read source directory
    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.pdf'));
    console.log(`Found ${files.length} PDFs to seed`);

    // 6. Process each file
    for (const file of files) {
      const srcPath = path.join(SOURCE_DIR, file);
      const targetFilename = `seed_${Date.now()}_${file.replace(/\s+/g, '_')}`;
      const destPath = path.join(TARGET_DIR, targetFilename);

      // Copy file
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} to uploads/resources/${targetFilename}`);

      // Map to resource fields
      let category = 'fullstack';
      let tags = ['notes', 'pdf'];
      
      const titleLower = file.toLowerCase();
      if (titleLower.includes('css')) {
        tags.push('css', 'frontend');
      } else if (titleLower.includes('html')) {
        tags.push('html', 'frontend');
      } else if (titleLower.includes('dsa')) {
        category = 'dsa';
        tags.push('dsa', 'algorithms', 'data structures');
      } else if (titleLower.includes('flask')) {
        category = 'fullstack';
        tags.push('python', 'flask', 'backend');
      } else if (titleLower.includes('js') || titleLower.includes('javascript')) {
        tags.push('javascript', 'js');
      } else if (titleLower.includes('java')) {
        category = 'dsa';
        tags.push('java', 'backend');
      } else if (titleLower.includes('php')) {
        category = 'fullstack';
        tags.push('php', 'backend');
      }

      const resourceTitle = file.replace('.pdf', '').replace(/_/g, ' ');

      const resource = new Resource({
        title: resourceTitle,
        description: `Complete notes and cheatsheet for ${resourceTitle}. Download and study to enhance your developer skills.`,
        category,
        difficulty: 'beginner',
        tags,
        language: 'English',
        resourceType: 'pdf',
        fileUrl: `/uploads/resources/${targetFilename}`, // This is relative path mapping to backend static path
        uploadedBy: admin._id,
        instructor: 'CodeSphere Verified',
        isPremium: false,
        status: 'published'
      });

      await resource.save();
      console.log(`Saved resource: ${resource.title}`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seedResources();
