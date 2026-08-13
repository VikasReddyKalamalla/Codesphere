const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Resource = require('../models/Resource');
const ResourceCategory = require('../models/ResourceCategory');
const User = require('../models/User');

const SOURCE_DIR = path.join(__dirname, '../../notes(resources)');
const TARGET_DIR = path.join(__dirname, '../uploads/resources');

const DEFAULT_PDF_URLS = {
  jsCheatsheet: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
  reactNotes:   'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
  cssGrid:      'https://www.orimi.com/pdf-test.pdf',
  bigO:         'https://arxiv.org/pdf/1301.3781.pdf',
  leetcode:     'https://arxiv.org/pdf/1409.0473.pdf',
  graphAlgo:    'https://arxiv.org/pdf/1512.03385.pdf',
  pandas:       'https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf',
  pytorch:      'https://cdn.openai.com/papers/gpt-4.pdf',
  sysDesign:    'https://arxiv.org/pdf/1706.03762.pdf',
  docker:       'https://arxiv.org/pdf/2005.14165.pdf',
  k8s:          'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
  aws:          'https://d1.awsstatic.com/whitepapers/aws-overview.pdf',
  owasp:        'https://owasp.org/www-pdf-archive/OWASP_Top_10-2017_%28en%29.pdf.pdf',
  networkSec:   'https://arxiv.org/pdf/1706.03762.pdf',
  interview:    'https://arxiv.org/pdf/1512.03385.pdf',
  sql:          'https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf',
};

const autoSeedResources = async () => {
  // Auto-seeding disabled completely so database stores only admin-created resources
  return;
};

    // 1. Get or create uploader admin user
    let admin = await User.findOne({ role: { $in: ['admin', 'instructor'] } });
    if (!admin) {
      admin = await User.findOne({});
    }
    const adminId = admin ? admin._id : new mongoose.Types.ObjectId();

    // 2. Ensure Categories exist
    const categoriesData = [
      { name: 'Full Stack & Web Dev', slug: 'fullstack',       icon: 'code',     color: '#04AA6D' },
      { name: 'DSA & Algorithms',     slug: 'dsa',             icon: 'terminal', color: '#3b82f6' },
      { name: 'AI, ML & Data Science', slug: 'ai',              icon: 'sparkles', color: '#8b5cf6' },
      { name: 'System Design',        slug: 'system_design',   icon: 'cpu',      color: '#f59e0b' },
      { name: 'Cloud & DevOps',       slug: 'cloud',           icon: 'globe',    color: '#06b6d4' },
      { name: 'Cyber Security',       slug: 'cybersecurity',   icon: 'shield',   color: '#ef4444' },
      { name: 'Interview & Placement',slug: 'placements',      icon: 'trophy',   color: '#ec4899' },
      { name: 'General CS',           slug: 'general-cs',      icon: 'book',     color: '#6366f1' },
    ];

    const catMap = {};
    for (const cData of categoriesData) {
      let existingCat = await ResourceCategory.findOne({ slug: cData.slug });
      if (!existingCat) {
        existingCat = await ResourceCategory.create(cData);
      }
      catMap[cData.slug] = existingCat._id;
    }

    // 3. Seed PDF notes from notes(resources) directory if present
    if (!fs.existsSync(TARGET_DIR)) {
      fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    let pdfCount = 0;
    if (fs.existsSync(SOURCE_DIR)) {
      const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.pdf'));
      for (const file of files) {
        const srcPath = path.join(SOURCE_DIR, file);
        const targetFilename = `seed_${Date.now()}_${file.replace(/\s+/g, '_')}`;
        const destPath = path.join(TARGET_DIR, targetFilename);

        try {
          fs.copyFileSync(srcPath, destPath);
        } catch (err) {
          // ignore copy errors
        }

        let categorySlug = 'fullstack';
        let tags = ['notes', 'pdf'];
        const titleLower = file.toLowerCase();

        if (titleLower.includes('css')) tags.push('css', 'frontend');
        else if (titleLower.includes('html')) tags.push('html', 'frontend');
        else if (titleLower.includes('dsa')) { categorySlug = 'dsa'; tags.push('dsa', 'algorithms'); }
        else if (titleLower.includes('flask')) tags.push('python', 'flask', 'backend');
        else if (titleLower.includes('js') || titleLower.includes('javascript')) tags.push('javascript', 'js');
        else if (titleLower.includes('java')) { categorySlug = 'dsa'; tags.push('java', 'backend'); }
        else if (titleLower.includes('php')) tags.push('php', 'backend');

        const resourceTitle = file.replace('.pdf', '').replace(/_/g, ' ');

        await Resource.create({
          title: resourceTitle,
          description: `Complete notes and cheatsheet for ${resourceTitle}. Download and study to enhance your developer skills.`,
          category: catMap[categorySlug] || 'Full Stack & Web Dev',
          difficulty: 'beginner',
          tags,
          language: 'English',
          resourceType: 'pdf',
          fileUrl: `/uploads/resources/${targetFilename}`,
          uploadedBy: adminId,
          instructor: 'CodeSphere Verified',
          isPremium: false,
          status: 'published'
        });
        pdfCount++;
      }
    }

    // 4. Seed standard curated resources
    const defaultResources = [
      {
        title: 'JavaScript ES6+ Cheatsheet',
        description: 'Complete reference for arrow functions, destructuring, spread/rest, modules, promises, and async/await.',
        resourceType: 'pdf', category: catMap['fullstack'] || 'Full Stack & Web Dev', difficulty: 'beginner',
        externalUrl: DEFAULT_PDF_URLS.jsCheatsheet, fileUrl: DEFAULT_PDF_URLS.jsCheatsheet,
        uploadedBy: adminId, status: 'published', views: 540, downloadsCount: 280, averageRating: 4.9, isFeatured: true, isTrending: true,
        tags: ['javascript', 'es6', 'cheatsheet', 'fullstack'],
      },
      {
        title: 'Node.js Event Loop Architecture Guide',
        description: 'Detailed video explanation of the Node.js event loop, call stack, microtasks, and task queues.',
        resourceType: 'video', category: catMap['fullstack'] || 'Full Stack & Web Dev', difficulty: 'intermediate',
        externalUrl: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ', fileUrl: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
        uploadedBy: adminId, status: 'published', views: 420, downloadsCount: 190, averageRating: 4.8, isFeatured: true,
        tags: ['nodejs', 'event-loop', 'async', 'fullstack'],
      },
      {
        title: 'React & Next.js App Router Masterclass Notes',
        description: 'Deep dive into Server Components, Server Actions, Suspense boundaries, streaming, and state management.',
        resourceType: 'pdf', category: catMap['fullstack'] || 'Full Stack & Web Dev', difficulty: 'advanced',
        externalUrl: DEFAULT_PDF_URLS.reactNotes, fileUrl: DEFAULT_PDF_URLS.reactNotes,
        uploadedBy: adminId, status: 'published', views: 680, downloadsCount: 340, averageRating: 4.9, isFeatured: true, isTrending: true,
        tags: ['react', 'nextjs', 'frontend', 'fullstack'],
      },
      {
        title: 'Big-O Complexity & Data Structures Cheatsheet',
        description: 'Time and space complexity tables for array, linked list, tree, graph, sorting algorithms, and hash tables.',
        resourceType: 'pdf', category: catMap['dsa'] || 'DSA & Algorithms', difficulty: 'beginner',
        externalUrl: DEFAULT_PDF_URLS.bigO, fileUrl: DEFAULT_PDF_URLS.bigO,
        uploadedBy: adminId, status: 'published', views: 920, downloadsCount: 510, averageRating: 4.9, isFeatured: true, isTrending: true,
        tags: ['algorithms', 'dsa', 'big-o', 'data-structures'],
      },
      {
        title: 'Blind 75 LeetCode Pattern Guide',
        description: 'Comprehensive breakdown of the Blind 75 LeetCode questions categorized by pattern.',
        resourceType: 'pdf', category: catMap['dsa'] || 'DSA & Algorithms', difficulty: 'intermediate',
        externalUrl: DEFAULT_PDF_URLS.leetcode, fileUrl: DEFAULT_PDF_URLS.leetcode,
        uploadedBy: adminId, status: 'published', views: 850, downloadsCount: 460, averageRating: 4.9, isFeatured: true, isTrending: true,
        tags: ['dsa', 'leetcode', 'algorithms', 'interview'],
      },
      {
        title: 'Python Pandas & NumPy Complete Reference',
        description: 'From DataFrames to groupby, merge, pivot tables, and time series — a comprehensive reference.',
        resourceType: 'pdf', category: catMap['ai'] || 'AI, ML & Data Science', difficulty: 'intermediate',
        externalUrl: DEFAULT_PDF_URLS.pandas, fileUrl: DEFAULT_PDF_URLS.pandas,
        uploadedBy: adminId, status: 'published', views: 480, downloadsCount: 260, averageRating: 4.8, isFeatured: true,
        tags: ['python', 'pandas', 'numpy', 'data-science', 'ai'],
      },
      {
        title: 'System Design Interview Architecture Guide',
        description: 'High-availability architecture patterns: Load balancers, API gateways, database sharding, caching, message queues.',
        resourceType: 'pdf', category: catMap['system_design'] || 'System Design', difficulty: 'advanced',
        externalUrl: DEFAULT_PDF_URLS.sysDesign, fileUrl: DEFAULT_PDF_URLS.sysDesign,
        uploadedBy: adminId, status: 'published', views: 980, downloadsCount: 580, averageRating: 4.9, isFeatured: true, isTrending: true,
        tags: ['system-design', 'microservices', 'architecture', 'scaling'],
      },
      {
        title: 'Docker & Containerization Master Class Notes',
        description: 'Dockerfile best practices, multi-stage builds, Docker Compose configurations, and container security.',
        resourceType: 'pdf', category: catMap['cloud'] || 'Cloud & DevOps', difficulty: 'intermediate',
        externalUrl: DEFAULT_PDF_URLS.docker, fileUrl: DEFAULT_PDF_URLS.docker,
        uploadedBy: adminId, status: 'published', views: 610, downloadsCount: 330, averageRating: 4.9, isFeatured: true,
        tags: ['docker', 'devops', 'containers', 'cloud'],
      },
      {
        title: 'OWASP Top 10 Web Security Cheat Sheet',
        description: 'How to prevent SQL injection, XSS, CSRF, broken authentication, and SSRF in modern web apps.',
        resourceType: 'pdf', category: catMap['cybersecurity'] || 'Cyber Security', difficulty: 'intermediate',
        externalUrl: DEFAULT_PDF_URLS.owasp, fileUrl: DEFAULT_PDF_URLS.owasp,
        uploadedBy: adminId, status: 'published', views: 410, downloadsCount: 205, averageRating: 4.9, isFeatured: true,
        tags: ['security', 'owasp', 'cybersecurity', 'web-dev'],
      },
      {
        title: 'Software Engineer Tech Interview Playbook',
        description: 'Complete placement preparation kit: Behavioral STAR method questions, resume templates, and HR prep.',
        resourceType: 'pdf', category: catMap['placements'] || 'Interview & Placement', difficulty: 'beginner',
        externalUrl: DEFAULT_PDF_URLS.interview, fileUrl: DEFAULT_PDF_URLS.interview,
        uploadedBy: adminId, status: 'published', views: 890, downloadsCount: 520, averageRating: 4.9, isFeatured: true, isTrending: true,
        tags: ['interview', 'placement', 'career', 'resume', 'placements'],
      },
    ];

    await Resource.insertMany(defaultResources);
    console.log(`[ResourceSeeder] Successfully seeded ${pdfCount + defaultResources.length} developer resources into MongoDB! ✅`);
  } catch (err) {
    console.error('[ResourceSeeder] Error during resource auto-seeding:', err.message);
  }
};

module.exports = { autoSeedResources };
