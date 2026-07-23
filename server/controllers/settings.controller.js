const settingsService = require('../services/settings.service');

exports.getSettings = async (req, res) => {
  try {
    const settings = await settingsService.getUserSettings(req.user._id);
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettingsSection = async (req, res) => {
  try {
    const { section } = req.params;
    const io = req.app.get('io');
    const updated = await settingsService.updateSettingsSection(req.user._id, section, req.body, io);
    res.status(200).json({ success: true, message: `${section} settings updated`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const devices = await settingsService.getUserDevices(req.user._id);
    res.status(200).json({ success: true, data: devices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.revokeDevice = async (req, res) => {
  try {
    const io = req.app.get('io');
    const result = await settingsService.revokeDevice(req.user._id, req.params.deviceId, io);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.revokeAllDevices = async (req, res) => {
  try {
    const io = req.app.get('io');
    const result = await settingsService.revokeAllDevices(req.user._id, io);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getApiKeys = async (req, res) => {
  try {
    const keys = await settingsService.getUserApiKeys(req.user._id);
    res.status(200).json({ success: true, data: keys });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateApiKey = async (req, res) => {
  try {
    const { keyName, scopes } = req.body;
    const result = await settingsService.generateApiKey(req.user._id, keyName, scopes);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.revokeApiKey = async (req, res) => {
  try {
    const result = await settingsService.revokeApiKey(req.user._id, req.params.keyId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBackups = async (req, res) => {
  try {
    const backups = await settingsService.getUserBackups(req.user._id);
    res.status(200).json({ success: true, data: backups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.triggerBackup = async (req, res) => {
  try {
    const io = req.app.get('io');
    const backup = await settingsService.triggerBackup(req.user._id, io);
    res.status(201).json({ success: true, data: backup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await settingsService.getActivityLogs(req.user._id);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportUserData = async (req, res) => {
  try {
    const settings = await settingsService.getUserSettings(req.user._id);
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      user: { id: req.user._id, name: req.user.name, email: req.user.email },
      settings,
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=codesphere-export.json');
    res.send(JSON.stringify(exportData, null, 2));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
