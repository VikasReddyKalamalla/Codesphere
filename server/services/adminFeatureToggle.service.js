const FeatureToggle = require('../models/FeatureToggle');
const AdminLog = require('../models/AdminLog');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Default feature toggles seeded on first request.
 */
const DEFAULT_TOGGLES = [
  { key: 'enable_learning',      label: 'Learning Module',       module: 'Learning',      enabled: true },
  { key: 'enable_resources',     label: 'Resources Module',      module: 'Resources',     enabled: true },
  { key: 'enable_community',     label: 'Community Module',      module: 'Community',     enabled: true },
  { key: 'enable_events',        label: 'Events Module',         module: 'Events',        enabled: true },
  { key: 'enable_live_sessions', label: 'Live Sessions Module',  module: 'LiveSessions',  enabled: true },
  { key: 'enable_codex',         label: 'Codex Module',          module: 'Codex',         enabled: true },
  { key: 'enable_sandbox',       label: 'Sandbox Module',        module: 'Sandbox',       enabled: true },
  { key: 'enable_tests',         label: 'Tests Module',          module: 'Tests',         enabled: true },
  { key: 'enable_notifications', label: 'Notifications Module',  module: 'Notifications', enabled: true },
  { key: 'enable_instructor',    label: 'Instructor Module',     module: 'Instructor',    enabled: true },
  { key: 'enable_analytics',     label: 'Analytics Module',      module: 'Analytics',     enabled: true },
];

/**
 * Get all feature toggles. Seeds defaults if none exist.
 */
const getFeatureToggles = async (query = {}) => {
  const { module: mod, enabled } = query;
  const filter = {};
  if (mod) filter.module = mod;
  if (typeof enabled !== 'undefined') filter.enabled = enabled === 'true';

  let toggles = await FeatureToggle.find(filter).sort({ module: 1, key: 1 });

  // Seed defaults on first call
  if (toggles.length === 0 && !mod && typeof enabled === 'undefined') {
    for (const t of DEFAULT_TOGGLES) {
      await FeatureToggle.findOneAndUpdate({ key: t.key }, t, { upsert: true, new: true });
    }
    toggles = await FeatureToggle.find({}).sort({ module: 1, key: 1 });
  }

  return { toggles };
};

/**
 * Update a single feature toggle by ID.
 */
const updateFeatureToggle = async (toggleId, data, adminId) => {
  const toggle = await FeatureToggle.findByIdAndUpdate(
    toggleId,
    { ...data, updatedBy: adminId },
    { new: true, runValidators: true }
  );

  if (!toggle) throw createError('Feature toggle not found', 404);

  await AdminLog.create({
    admin: adminId,
    action: `Feature Toggle "${toggle.key}" ${toggle.enabled ? 'Enabled' : 'Disabled'}`,
    module: 'Settings',
    details: data,
  });

  return toggle;
};

module.exports = { getFeatureToggles, updateFeatureToggle };
