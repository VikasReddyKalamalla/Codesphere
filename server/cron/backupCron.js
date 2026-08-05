const cron = require('node-cron');
const { performFullBackup } = require('../services/backup.service');
const logger = require('../utils/logger');

/**
 * Initializes automated database backup cron job
 * Runs every day at 02:00 AM UTC
 */
const initBackupCron = () => {
  const cronSchedule = process.env.BACKUP_CRON_SCHEDULE || '0 2 * * *';

  logger.info(`[Backup Cron] Registering automated database backup schedule: "${cronSchedule}"`);

  cron.schedule(cronSchedule, async () => {
    logger.info('[Backup Cron] Triggering scheduled daily MongoDB & Redis database backup...');
    try {
      const result = await performFullBackup();
      logger.info(`[Backup Cron] ✓ Daily backup finished successfully at ${result.timestamp}`);
    } catch (err) {
      logger.error(`[Backup Cron] ✖ Scheduled database backup failed: ${err.message}`);
    }
  });
};

module.exports = { initBackupCron };
