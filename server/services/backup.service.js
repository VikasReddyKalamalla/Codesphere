/**
 * Backup & Disaster Recovery Service
 * Automated backup management
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');
const logger = require('../utils/logger');

const BACKUP_DIR = process.env.BACKUP_DIR || './backups';
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
const AWS_REGION = process.env.AWS_REGION;

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Ensure backup directory exists
 */
const ensureBackupDir = () => {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    logger.info(`Created backup directory: ${BACKUP_DIR}`);
  }
};

/**
 * Create MongoDB backup
 */
const backupMongoDB = async () => {
  return new Promise((resolve, reject) => {
    ensureBackupDir();

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupFile = path.join(BACKUP_DIR, `mongodb_${timestamp}.archive`);
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      return reject(createError('MONGO_URI not configured', 400));
    }

    logger.info(`Starting MongoDB backup to ${backupFile}`);

    const mongodump = spawn('mongodump', [
      '--uri',
      mongoUri,
      '--archive',
      backupFile,
    ]);

    mongodump.on('close', (code) => {
      if (code === 0) {
        const stats = fs.statSync(backupFile);
        logger.info(`✓ MongoDB backup completed: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        resolve({
          type: 'mongodb',
          file: backupFile,
          size: stats.size,
          timestamp,
        });
      } else {
        logger.error(`MongoDB backup failed with code ${code}`);
        reject(createError('MongoDB backup failed', 500));
      }
    });

    mongodump.on('error', (error) => {
      logger.error(`Backup error: ${error.message}`);
      reject(error);
    });
  });
};

/**
 * Create Redis backup
 */
const backupRedis = async () => {
  try {
    ensureBackupDir();

    const redis = require('redis');
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const client = redis.createClient({ url: redisUrl });

    await client.connect();
    await client.sendCommand(['BGSAVE']);
    await client.disconnect();

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    logger.info(`✓ Redis backup initiated: ${timestamp}`);

    return {
      type: 'redis',
      timestamp,
      status: 'initiated',
    };
  } catch (error) {
    logger.error(`Redis backup error: ${error.message}`);
    throw createError('Redis backup failed', 500);
  }
};

/**
 * Upload backup to S3
 */
const uploadToS3 = async (backupFile) => {
  try {
    if (!AWS_S3_BUCKET) {
      logger.warn('AWS S3 bucket not configured, skipping S3 upload');
      return null;
    }

    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({ region: AWS_REGION });

    const fileContent = fs.readFileSync(backupFile);
    const fileName = path.basename(backupFile);

    const params = {
      Bucket: AWS_S3_BUCKET,
      Key: `backups/${fileName}`,
      Body: fileContent,
      ContentType: 'application/octet-stream',
    };

    await s3.upload(params).promise();
    logger.info(`✓ Backup uploaded to S3: s3://${AWS_S3_BUCKET}/backups/${fileName}`);

    return {
      bucket: AWS_S3_BUCKET,
      key: `backups/${fileName}`,
      region: AWS_REGION,
    };
  } catch (error) {
    logger.error(`S3 upload error: ${error.message}`);
    throw createError('Failed to upload backup to S3', 500);
  }
};

/**
 * List available backups
 */
const listBackups = () => {
  try {
    ensureBackupDir();

    const files = fs.readdirSync(BACKUP_DIR);
    const backups = files
      .filter((f) => f.endsWith('.archive'))
      .map((f) => {
        const filePath = path.join(BACKUP_DIR, f);
        const stats = fs.statSync(filePath);
        return {
          name: f,
          size: stats.size,
          createdAt: stats.birthtime,
          path: filePath,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return {
      total: backups.length,
      backups,
    };
  } catch (error) {
    logger.error(`List backups error: ${error.message}`);
    throw createError('Failed to list backups', 500);
  }
};

/**
 * Delete old backups (keep only recent ones)
 */
const cleanupOldBackups = (keepDays = 30) => {
  try {
    ensureBackupDir();

    const cutoffTime = Date.now() - keepDays * 24 * 60 * 60 * 1000;
    const files = fs.readdirSync(BACKUP_DIR);

    let deletedCount = 0;
    files.forEach((f) => {
      const filePath = path.join(BACKUP_DIR, f);
      const stats = fs.statSync(filePath);

      if (stats.birthtime.getTime() < cutoffTime) {
        fs.unlinkSync(filePath);
        deletedCount++;
        logger.info(`Deleted old backup: ${f}`);
      }
    });

    return {
      deleted: deletedCount,
      kept: files.length - deletedCount,
    };
  } catch (error) {
    logger.error(`Backup cleanup error: ${error.message}`);
    throw createError('Failed to cleanup backups', 500);
  }
};

/**
 * Restore from backup
 */
const restoreFromBackup = async (backupFile) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(backupFile)) {
      return reject(createError('Backup file not found', 404));
    }

    logger.info(`Starting restore from ${backupFile}`);

    const mongorestore = spawn('mongorestore', [
      '--archive',
      backupFile,
      '--drop',
      '--uri',
      process.env.MONGO_URI,
    ]);

    mongorestore.on('close', (code) => {
      if (code === 0) {
        logger.info(`✓ Restore completed successfully`);
        resolve({
          status: 'completed',
          backupFile,
          timestamp: new Date(),
        });
      } else {
        logger.error(`Restore failed with code ${code}`);
        reject(createError('Restore failed', 500));
      }
    });

    mongorestore.on('error', (error) => {
      logger.error(`Restore error: ${error.message}`);
      reject(error);
    });
  });
};

/**
 * Full backup routine (MongoDB + Redis)
 */
const performFullBackup = async () => {
  try {
    logger.info('Starting full backup routine...');

    const backups = {};

    // Backup MongoDB
    try {
      backups.mongodb = await backupMongoDB();
      backups.mongodb.s3 = await uploadToS3(backups.mongodb.file);
    } catch (error) {
      logger.error(`MongoDB backup failed: ${error.message}`);
      backups.mongodb = { error: error.message };
    }

    // Backup Redis
    try {
      backups.redis = await backupRedis();
    } catch (error) {
      logger.error(`Redis backup failed: ${error.message}`);
      backups.redis = { error: error.message };
    }

    // Cleanup old backups
    const cleanup = cleanupOldBackups(30);
    backups.cleanup = cleanup;

    logger.info('✓ Full backup routine completed');

    return {
      status: 'completed',
      timestamp: new Date(),
      backups,
    };
  } catch (error) {
    logger.error(`Full backup routine error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  backupMongoDB,
  backupRedis,
  uploadToS3,
  listBackups,
  cleanupOldBackups,
  restoreFromBackup,
  performFullBackup,
};
