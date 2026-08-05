const asyncHandler           = require('../utils/asyncHandler');
const { successResponse }    = require('../utils/apiResponse');
const authService            = require('../services/auth.service');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  return successResponse(res, 201, 'Account created successfully', data);
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  return successResponse(res, 200, 'Login successful', data);
});

// GET /api/auth/me  (protected)
const getMe = asyncHandler(async (req, res) => {
  const data = await authService.getMe(req.user._id);
  return successResponse(res, 200, 'User fetched successfully', data);
});

// PUT /api/auth/profile  (protected)
const updateProfile = asyncHandler(async (req, res) => {
  const data = await authService.updateProfile(req.user._id, req.body);
  return successResponse(res, 200, 'Profile updated successfully', data);
});

// POST /api/auth/google
const googleAuth = asyncHandler(async (req, res) => {
  const data = await authService.googleAuth(req.body);
  return successResponse(res, 200, 'Google login successful', data);
});

// POST /api/auth/logout  (protected)
const logout = asyncHandler(async (req, res) => {
  // Stateless JWT — client must discard the token.
  // Token blacklisting / refresh-token invalidation will be added in a later phase.
  return successResponse(res, 200, 'Logged out successfully');
});

module.exports = { register, login, getMe, updateProfile, googleAuth, logout };

