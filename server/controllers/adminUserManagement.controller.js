const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const userMgmtService = require('../services/adminUserManagement.service');

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userMgmtService.getAllUsers(req.query);
  successResponse(res, 200, 'Users fetched', result);
});

const getUserById = asyncHandler(async (req, res) => {
  const result = await userMgmtService.getUserById(req.params.id);
  successResponse(res, 200, 'User fetched', result);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userMgmtService.updateUser(req.params.id, req.body, req.user._id);
  successResponse(res, 200, 'User updated', { user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const result = await userMgmtService.deleteUser(
    req.params.id,
    req.user._id,
    req.query.hard === 'true'
  );
  successResponse(res, 200, result.message, {});
});

const suspendUser = asyncHandler(async (req, res) => {
  const result = await userMgmtService.suspendUser(
    req.params.id,
    req.user._id,
    req.body.reason
  );
  successResponse(res, 200, result.message, {});
});

const activateUser = asyncHandler(async (req, res) => {
  const result = await userMgmtService.activateUser(req.params.id, req.user._id);
  successResponse(res, 200, result.message, {});
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await userMgmtService.updateUserRole(
    req.params.id,
    req.body.role,
    req.user._id
  );
  successResponse(res, 200, 'User role updated', { user });
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await userMgmtService.resetPassword(req.params.id, req.user._id);
  successResponse(res, 200, result.message, { tempPassword: result.tempPassword });
});

const sendNotification = asyncHandler(async (req, res) => {
  const { title, message } = req.body;
  const result = await userMgmtService.sendNotification(req.params.id, title, message, req.user._id);
  successResponse(res, 200, result.message);
});

const sendEmail = asyncHandler(async (req, res) => {
  const { subject, body } = req.body;
  const result = await userMgmtService.sendEmail(req.params.id, subject, body, req.user._id);
  successResponse(res, 200, result.message);
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  updateUserRole,
  resetPassword,
  sendNotification,
  sendEmail,
};
