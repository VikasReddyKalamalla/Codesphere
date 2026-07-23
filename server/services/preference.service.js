const NotificationPreference = require('../models/NotificationPreference');

/**
 * Get or create notification preferences for a user.
 * If no document exists, defaults are applied automatically by the schema.
 */
const getPreferences = async (userId) => {
  let prefs = await NotificationPreference.findOne({ user: userId });

  if (!prefs) {
    prefs = await NotificationPreference.create({ user: userId });
  }

  return prefs;
};

/**
 * Update notification preferences for a user.
 * Uses deep merge so callers only need to send changed fields.
 */
const updatePreferences = async (userId, data) => {
  const prefs = await NotificationPreference.findOneAndUpdate(
    { user: userId },
    { $set: data },
    { new: true, upsert: true, runValidators: true }
  );

  return prefs;
};

module.exports = {
  getPreferences,
  updatePreferences,
};
