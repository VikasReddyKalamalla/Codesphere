const fs = require('fs');
const path = require('path');

let mockResources = [];
let isMockSeeded = false;

const seedMockResources = () => {
  if (isMockSeeded) return mockResources;

  const SOURCE_DIR = path.join(__dirname, '../../notes(resources)');
  const TARGET_DIR = path.join(__dirname, '../uploads/resources');
  
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  try {
    if (fs.existsSync(SOURCE_DIR)) {
      const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.pdf'));
      let idCounter = 1;
      
      for (const file of files) {
        const srcPath = path.join(SOURCE_DIR, file);
        const targetFilename = `seed_mock_${file.replace(/\s+/g, '_')}`;

        let category = 'Full Stack & Web Dev';
        let tags = ['notes', 'pdf'];
        const titleLower = file.toLowerCase();

        if (titleLower.includes('dsa') || titleLower.includes('java')) {
          category = 'DSA & Algorithms';
        }

        const resourceTitle = file.replace('.pdf', '').replace(/_/g, ' ');

        mockResources.push({
          _id: `mock_res_${idCounter++}`,
          title: resourceTitle,
          description: `Complete notes and cheatsheet for ${resourceTitle}. Download and study to enhance your developer skills.`,
          category: category,
          difficulty: 'beginner',
          tags,
          resourceType: 'pdf',
          fileUrl: `/mock-resources-proxy/${file}`,
          uploadedBy: { fullName: 'CodeSphere Admin', avatar: '' },
          views: 120,
          downloadsCount: 45,
          averageRating: 4.8,
          createdAt: new Date(),
          status: 'published'
        });
      }
    }
  } catch (err) {
    console.error('Error seeding mock resources:', err);
  }

  isMockSeeded = true;
  return mockResources;
};

module.exports = { seedMockResources };
