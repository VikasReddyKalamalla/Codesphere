const PlatformSetting = require('../models/PlatformSetting');
const AdminLog = require('../models/AdminLog');

/**
 * Get the singleton platform settings document.
 * Creates it with defaults if it doesn't exist yet.
 */
const getSettings = async () => {
  let settings = await PlatformSetting.findOne();
  if (!settings) {
    settings = await PlatformSetting.create({});
  }
  return settings;
};

/**
 * Update platform settings (deep merge via $set).
 */
const updateSettings = async (data, adminId) => {
  const settings = await PlatformSetting.findOneAndUpdate(
    {},
    { $set: { ...data, lastUpdatedBy: adminId } },
    { upsert: true, new: true, runValidators: true }
  );

  await AdminLog.create({
    admin: adminId,
    action: 'Platform Settings Updated',
    module: 'Settings',
    details: data,
  });

  return settings;
};

module.exports = { getSettings, updateSettings };
