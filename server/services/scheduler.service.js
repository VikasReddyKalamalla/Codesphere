/**
 * Task Scheduler Service
 * Automated scheduled tasks (backup, cleanup, reports)
 */

const cron = require('node-cron');
const logger = require('../utils/logger');
const backupService = require('./backup.service');
const analyticsService = require('./analyticsAdvanced.service');

let scheduledJobs = [];

/**
 * Schedule daily backup at 2 AM
 */
const scheduleDailyBackup = () => {
  const job = cron.schedule('0 2 * * *', async () => {
    logger.info('Running scheduled daily backup...');
    try {
      await backupService.performFullBackup();
      logger.info('✓ Scheduled backup completed');
    } catch (error) {
      logger.error(`Scheduled backup failed: ${error.message}`);
    }
  });

  scheduledJobs.push({ name: 'dailyBackup', job });
  logger.info('✓ Daily backup scheduled at 2:00 AM');
};

/**
 * Schedule backup cleanup every Sunday at 3 AM
 */
const scheduleBackupCleanup = () => {
  const job = cron.schedule('0 3 * * 0', () => {
    logger.info('Running scheduled backup cleanup...');
    try {
      const result = backupService.cleanupOldBackups(30);
      logger.info(`✓ Cleanup completed: ${result.deleted} deleted, ${result.kept} kept`);
    } catch (error) {
      logger.error(`Backup cleanup failed: ${error.message}`);
    }
  });

  scheduledJobs.push({ name: 'backupCleanup', job });
  logger.info('✓ Backup cleanup scheduled for Sundays at 3:00 AM');
};

/**
 * Schedule weekly report generation
 */
const scheduleWeeklyReport = () => {
  const job = cron.schedule('0 0 * * 1', async () => {
    logger.info('Generating scheduled weekly report...');
    try {
      const report = await analyticsService.generateReport('full');
      logger.info('✓ Weekly report generated');
    } catch (error) {
      logger.error(`Report generation failed: ${error.message}`);
    }
  });

  scheduledJobs.push({ name: 'weeklyReport', job });
  logger.info('✓ Weekly report scheduled for Mondays at 00:00 AM');
};

/**
 * Schedule health check every 5 minutes
 */
const scheduleHealthCheck = () => {
  const job = cron.schedule('*/5 * * * *', async () => {
    try {
      const mongoose = require('mongoose');
      const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

      if (dbStatus === 'disconnected') {
        logger.warn('⚠️ Database health check: DISCONNECTED');
      }
    } catch (error) {
      logger.error(`Health check error: ${error.message}`);
    }
  });

  scheduledJobs.push({ name: 'healthCheck', job });
  logger.info('✓ Health check scheduled every 5 minutes');
};

/**
 * Start all scheduled jobs
 */
const initializeScheduler = () => {
  logger.info('Initializing task scheduler...');

  try {
    if (process.env.ENABLE_SCHEDULED_BACKUP === 'true') {
      scheduleDailyBackup();
      scheduleBackupCleanup();
    }

    if (process.env.ENABLE_SCHEDULED_REPORTS === 'true') {
      scheduleWeeklyReport();
    }

    scheduleHealthCheck();

    logger.info(`✓ Task scheduler initialized with ${scheduledJobs.length} jobs`);
  } catch (error) {
    logger.error(`Scheduler initialization error: ${error.message}`);
  }
};

/**
 * Stop all scheduled jobs
 */
const stopScheduler = () => {
  logger.info('Stopping task scheduler...');

  scheduledJobs.forEach(({ name, job }) => {
    job.stop();
    logger.info(`Stopped scheduled job: ${name}`);
  });

  scheduledJobs = [];
  logger.info('✓ Task scheduler stopped');
};

/**
 * Get scheduled jobs info
 */
const getScheduledJobs = () => {
  return {
    total: scheduledJobs.length,
    jobs: scheduledJobs.map(({ name }) => name),
  };
};

module.exports = {
  initializeScheduler,
  stopScheduler,
  getScheduledJobs,
  scheduleDailyBackup,
  scheduleBackupCleanup,
  scheduleWeeklyReport,
  scheduleHealthCheck,
};
