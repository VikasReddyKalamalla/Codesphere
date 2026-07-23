const logService = require('../services/log.service');

/**
 * GET /api/notification-logs
 * Get notification logs (Admin can see all, users see only their own).
 */
const getLogs = async (req, res) => {
  const result = await logService.getLogs(req.query, req.user);

  res.status(200).json({
    success: true,
    ...result,
  });
};

/**
 * GET /api/notification-logs/:id
 * Get a single log entry by ID.
 */
const getLogById = async (req, res) => {
  const log = await logService.getLogById(req.params.id, req.user);

  res.status(200).json({
    success: true,
    log,
  });
};

module.exports = {
  getLogs,
  getLogById,
};
