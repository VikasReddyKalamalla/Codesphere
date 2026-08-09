const asyncHandler  = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const profileService = require('../services/profile.service');

const getProfile    = asyncHandler(async (req, res) => successResponse(res, 200, 'Profile fetched', await profileService.getProfile(req.user._id)));
const updateProfile = asyncHandler(async (req, res) => successResponse(res, 200, 'Profile updated', await profileService.updateProfile(req.user._id, req.body)));
const uploadAvatar  = asyncHandler(async (req, res) => successResponse(res, 200, 'Avatar uploaded', await profileService.uploadAvatar(req.user._id, req.file)));
const getPublicProfile = asyncHandler(async (req, res) => successResponse(res, 200, 'Public profile fetched', await profileService.getPublicProfile(req.params.username)));
const uploadCertificate = asyncHandler(async (req, res) => successResponse(res, 201, 'Certificate uploaded', await profileService.uploadCertificate(req.user._id, req.body, req.file)));

module.exports = { getProfile, updateProfile, uploadAvatar, getPublicProfile, uploadCertificate };
