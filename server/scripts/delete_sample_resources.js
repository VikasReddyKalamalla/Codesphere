const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const Resource = require('../models/Resource');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas.');

  const sampleTitles = [
    'Software Engineer Tech Interview Playbook',
    'Docker & Containerization Master Class Notes',
    'OWASP Top 10 Web Security Cheat Sheet',
    'Python Pandas & NumPy Complete Reference',
    'System Design Interview Architecture Guide',
    'Big-O Complexity & Data Structures Cheatsheet',
    'Blind 75 LeetCode Pattern Guide',
    'Node.js Event Loop Architecture Guide',
    'React & Next.js App Router Masterclass Notes',
    'JavaScript ES6+ Cheatsheet'
  ];

  const res = await Resource.deleteMany({ title: { $in: sampleTitles } });
  console.log(`Deleted ${res.deletedCount} sample resources.`);

  const remaining = await Resource.find({}, 'title resourceType fileUrl externalUrl');
  console.log(`\nRemaining Resources (${remaining.length}):`);
  remaining.forEach(r => console.log(`- [${r._id}] ${r.title} (${r.resourceType})`));

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
