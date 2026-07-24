/**
 * Database Indexing Configuration
 * Ensures optimal query performance by creating necessary indexes
 * Run this after connecting to database or during startup
 */

const logger = require('../utils/logger');

// Import all models that need indexing
const models = {
  User: require('../models/User'),
  SandboxProject: require('../models/SandboxProject'),
  SandboxProgress: require('../models/SandboxProgress'),
  SandboxSubmission: require('../models/SandboxSubmission'),
  SandboxBookmark: require('../models/SandboxBookmark'),
  Session: require('../models/Session'),
  Payment: require('../models/Payment'),
  Notification: require('../models/Notification'),
  Course: require('../models/Lesson'), // Example
  WorkspaceFile: require('../models/WorkspaceFile'),
  Workspace: require('../models/Workspace'),
};

/**
 * Index specifications for each model
 */
const indexSpecs = {
  User: [
    { spec: { email: 1 }, options: { unique: true, sparse: true } },
    { spec: { username: 1 }, options: { unique: true, sparse: true } },
    { spec: { role: 1, createdAt: -1 }, options: {} },
    { spec: { subscription: 1 }, options: {} },
  ],
  SandboxProject: [
    { spec: { instructor: 1, createdAt: -1 }, options: {} },
    { spec: { isPublished: 1, createdAt: -1 }, options: {} },
    { spec: { category: 1, difficulty: 1 }, options: {} },
    { spec: { technologyStack: 1 }, options: {} },
    { spec: { enrolledCount: -1 }, options: {} },
    { spec: { title: 'text', description: 'text', tags: 'text' }, options: {} },
  ],
  SandboxProgress: [
    { spec: { projectId: 1, userId: 1 }, options: { unique: true } },
    { spec: { userId: 1, status: 1 }, options: {} },
    { spec: { projectId: 1, completionPercent: -1 }, options: {} },
    { spec: { userId: 1, completedAt: -1 }, options: {} },
  ],
  SandboxSubmission: [
    { spec: { projectId: 1, userId: 1, createdAt: -1 }, options: {} },
    { spec: { status: 1, createdAt: -1 }, options: {} },
    { spec: { userId: 1, createdAt: -1 }, options: {} },
  ],
  SandboxBookmark: [
    { spec: { userId: 1, projectId: 1 }, options: { unique: true } },
    { spec: { userId: 1, createdAt: -1 }, options: {} },
  ],
  Session: [
    { spec: { instructor: 1, createdAt: -1 }, options: {} },
    { spec: { status: 1, startTime: -1 }, options: {} },
    { spec: { attendees: 1 }, options: {} },
  ],
  Payment: [
    { spec: { userId: 1, createdAt: -1 }, options: {} },
    { spec: { status: 1, createdAt: -1 }, options: {} },
    { spec: { transactionId: 1 }, options: { unique: true } },
  ],
  Notification: [
    { spec: { userId: 1, read: 1, createdAt: -1 }, options: {} },
    { spec: { userId: 1, createdAt: -1 }, options: {} },
    { spec: { type: 1, createdAt: -1 }, options: {} },
  ],
  Workspace: [
    { spec: { owner: 1, createdAt: -1 }, options: {} },
    { spec: { members: 1 }, options: {} },
  ],
  WorkspaceFile: [
    { spec: { workspaceId: 1, createdAt: -1 }, options: {} },
    { spec: { userId: 1, createdAt: -1 }, options: {} },
  ],
};

/**
 * Create all indexes
 */
const createIndexes = async () => {
  try {
    logger.info('Starting database index creation...');

    for (const [modelName, model] of Object.entries(models)) {
      if (!model || !indexSpecs[modelName]) {
        logger.warn(`Skipping indexes for model: ${modelName}`);
        continue;
      }

      const indexes = indexSpecs[modelName];

      for (const index of indexes) {
        try {
          await model.collection.createIndex(index.spec, index.options);
          logger.info(`✓ Index created for ${modelName}: ${JSON.stringify(index.spec)}`);
        } catch (error) {
          if (error.code === 85) {
            // Index with same name but different spec already exists
            logger.warn(`Index already exists for ${modelName}, skipping...`);
          } else {
            logger.error(`Failed to create index for ${modelName}: ${error.message}`);
          }
        }
      }
    }

    logger.info('✓ Database indexing complete');
  } catch (error) {
    logger.error(`Database indexing error: ${error.message}`);
    throw error;
  }
};

/**
 * Drop all indexes (use with caution)
 */
const dropAllIndexes = async () => {
  try {
    logger.warn('Dropping all database indexes...');

    for (const [modelName, model] of Object.entries(models)) {
      if (!model) continue;
      await model.collection.dropAllIndexes();
      logger.info(`✓ All indexes dropped for ${modelName}`);
    }

    logger.warn('✓ All database indexes dropped');
  } catch (error) {
    logger.error(`Failed to drop indexes: ${error.message}`);
  }
};

module.exports = {
  createIndexes,
  dropAllIndexes,
};
