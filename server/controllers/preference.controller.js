const preferenceService = require('../services/preference.service');

/**
 * GET /api/notification-preferences
 * Retrieve notification preferences for the authenticated user.
 */
const getPreferences = async (req, res) => {
  const preferences = await preferenceService.getPreferences(req.user._id);

  res.status(200).json({
    success: true,
    preferences,
  });
};

/**
 * PUT /api/notification-preferences
 * Update notification preferences for the authenticated user.
 */
const updatePreferences = async (req, res) => {
  const preferences = await preferenceService.updatePreferences(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: 'Preferences updated successfully',
    preferences,
  });
};

module.exports = {
  getPreferences,
  updatePreferences,
};
