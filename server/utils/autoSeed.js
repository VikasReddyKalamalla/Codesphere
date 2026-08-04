const mongoose = require('mongoose');
const seed = require('../seed');

const LearningPath = require('../models/LearningPath');
const SandboxProject = require('../models/SandboxProject');
const Community = require('../models/Community');
const Workspace = require('../models/Workspace');

/**
 * Auto-seed database if core collections are empty.
 */
const autoSeedIfEmpty = async () => {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      console.log('[AutoSeed] MongoDB not connected, skipping seed.');
      return;
    }

    const pathCount = await LearningPath.countDocuments().catch(() => 0);
    const sandboxCount = await SandboxProject.countDocuments().catch(() => 0);
    const commCount = await Community.countDocuments().catch(() => 0);

    if (pathCount === 0 || sandboxCount === 0 || commCount === 0) {
      console.log('[AutoSeed] Database is missing core content. Running automatic database seed...');
      await seed();
      console.log('[AutoSeed] Automatic database seeding complete! ✅');
    } else {
      console.log(`[AutoSeed] Database contains ${pathCount} learning paths, ${sandboxCount} sandbox projects, ${commCount} community spaces.`);
    }
  } catch (err) {
    console.error('[AutoSeed] Error during auto-seeding:', err.message);
  }
};

module.exports = { autoSeedIfEmpty };
