const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const auditService = require('../services/adminAudit.service');

const getAuditLogs = asyncHandler(async (req, res) => {
  const result = await auditService.getAuditLogs(req.query);
  successResponse(res, 200, 'Audit logs fetched', result);
});

module.exports = { getAuditLogs };
