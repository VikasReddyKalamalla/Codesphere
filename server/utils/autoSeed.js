const mongoose = require('mongoose');
const seed = require('../seed');

const LearningPath = require('../models/LearningPath');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const SandboxProject = require('../models/SandboxProject');
const Community = require('../models/Community');
const Workspace = require('../models/Workspace');

/**
 * Ensures all 83 roadmaps from roadmapsData.json are populated into MongoDB.
 */
const seedRoadmapsOnly = async () => {
  let roadmapsData = [];
  try {
    roadmapsData = require('../data/roadmapsData.json');
  } catch (err) {
    console.error('[RoadmapSeed] Could not load roadmapsData.json:', err.message);
    return;
  }

  let creator = await User.findOne({ role: { $in: ['admin', 'instructor'] } });
  if (!creator) {
    creator = await User.findOne({});
  }
  const creatorId = creator ? creator._id : new mongoose.Types.ObjectId();

  let addedCount = 0;
  for (const rd of roadmapsData) {
    const existing = await LearningPath.findOne({ 
      $or: [
        { title: rd.title },
        { title: { $regex: `^${rd.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }
      ] 
    });

    if (existing) continue;

    const createdPath = await LearningPath.create({
      title: rd.title,
      description: rd.description,
      category: rd.category || 'General',
      difficulty: rd.difficulty || 'beginner',
      duration: rd.duration || 180,
      rating: 4.8,
      totalStudents: Math.floor(Math.random() * 800) + 200,
      createdBy: creatorId,
      isPublished: true,
      isPremium: false,
    });

    const createdModuleIds = [];
    if (rd.modules && rd.modules.length > 0) {
      for (const modData of rd.modules) {
        const createdMod = await Module.create({
          learningPathId: createdPath._id,
          title: modData.title,
          order: modData.order || 1,
          description: modData.description || `Module covering ${modData.title}`,
          duration: 180,
        });
        createdModuleIds.push(createdMod._id);

        const createdLessonIds = [];
        if (modData.lessons && modData.lessons.length > 0) {
          for (let lIdx = 0; lIdx < modData.lessons.length; lIdx++) {
            const lData = modData.lessons[lIdx];
            const createdLesson = await Lesson.create({
              moduleId: createdMod._id,
              title: lData.title,
              type: lData.type || 'article',
              duration: lData.duration || 25,
              order: lIdx + 1,
              isFree: lIdx === 0,
              article: `# ${lData.title}\n\n## Overview\nWelcome to **${lData.title}** as part of **${modData.title}** in the **${rd.title}** learning path.\n\n## Key Takeaways\n- Understand foundational concepts and industry best practices.\n- Apply concepts step-by-step with practical hands-on exercises.\n- Practice coding challenges in the CodeSphere interactive sandbox.`,
              videoUrl: lData.type === 'video' ? 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' : '',
              code: lData.type === 'code' ? `// ${lData.title}\n// Write your solution below\n\nconsole.log("Practicing ${lData.title}");` : ''
            });
            createdLessonIds.push(createdLesson._id);
          }
        }
        await Module.findByIdAndUpdate(createdMod._id, { lessons: createdLessonIds });
      }
    }
    await LearningPath.findByIdAndUpdate(createdPath._id, { modules: createdModuleIds });
    addedCount++;
  }

  if (addedCount > 0) {
    console.log(`[AutoSeed] Successfully seeded ${addedCount} missing tech roadmaps into MongoDB! ✅`);
  }
};

const Resource = require('../models/Resource');
const { autoSeedResources } = require('./resourceSeeder');

let isSeeding = false;

/**
 * Auto-seed database if core collections are empty or missing roadmaps.
 */
const autoSeedIfEmpty = async () => {
  if (isSeeding) return;
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      console.log('[AutoSeed] MongoDB not connected, skipping seed.');
      return;
    }

    const pathCount = await LearningPath.countDocuments().catch(() => 0);
    const sandboxCount = await SandboxProject.countDocuments().catch(() => 0);
    const commCount = await Community.countDocuments().catch(() => 0);
    const resourceCount = await Resource.countDocuments().catch(() => 0);

    if (pathCount === 0 || sandboxCount === 0 || commCount === 0) {
      isSeeding = true;
      console.log('[AutoSeed] Database missing core content. Running automatic database seed...');
      await seed();
      console.log('[AutoSeed] Automatic database seeding complete! ✅');
    } else if (pathCount < 80) {
      isSeeding = true;
      console.log(`[AutoSeed] Database contains ${pathCount} learning paths. Syncing 83 native roadmaps...`);
      await seedRoadmapsOnly();
    } else {
      console.log(`[AutoSeed] Database contains ${pathCount} learning paths, ${sandboxCount} sandbox projects, ${commCount} community spaces, ${resourceCount} resources.`);
    }

    if (resourceCount === 0) {
      await autoSeedResources();
    }
  } catch (err) {
    console.error('[AutoSeed] Error during auto-seeding:', err.message);
  } finally {
    isSeeding = false;
  }
};

module.exports = { autoSeedIfEmpty, seedRoadmapsOnly };

