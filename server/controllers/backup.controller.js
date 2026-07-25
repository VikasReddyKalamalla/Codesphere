const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const backupService = require('../services/backup.service');
const { restrictTo } = require('../middlewares/role.middleware');

/**
 * Trigger full backup
 * POST /api/backups/full
 */
const triggerFullBackup = asyncHandler(async (req, res) => {
  const result = await backupService.performFullBackup();
  return successResponse(res, 200, 'Full backup completed', result);
});

/**
 * Backup MongoDB
 * POST /api/backups/mongodb
 */
const backupMongoDB = asyncHandler(async (req, res) => {
  const result = await backupService.backupMongoDB();
  return successResponse(res, 200, 'MongoDB backup completed', result);
});

/**
 * Backup Redis
 * POST /api/backups/redis
 */
const backupRedis = asyncHandler(async (req, res) => {
  const result = await backupService.backupRedis();
  return successResponse(res, 200, 'Redis backup initiated', result);
});

/**
 * List available backups
 * GET /api/backups/list
 */
const listBackups = asyncHandler(async (req, res) => {
  const result = backupService.listBackups();
  return successResponse(res, 200, 'Backups listed', result);
});

/**
 * Restore from backup
 * POST /api/backups/restore
 */
const restoreBackup = asyncHandler(async (req, res) => {
  const { backupFile } = req.body;

  if (!backupFile) {
    return errorResponse(res, 400, 'Backup file path required');
  }

  const result = await backupService.restoreFromBackup(backupFile);
  return successResponse(res, 200, 'Restore completed', result);
});

/**
 * Clean up old backups
 * POST /api/backups/cleanup
 */
const cleanupBackups = asyncHandler(async (req, res) => {
  const { keepDays = 30 } = req.body;

  const result = backupService.cleanupOldBackups(keepDays);
  return successResponse(res, 200, 'Backup cleanup completed', result);
});

module.exports = {
  triggerFullBackup,
  backupMongoDB,
  backupRedis,
  listBackups,
  restoreBackup,
  cleanupBackups,
};
