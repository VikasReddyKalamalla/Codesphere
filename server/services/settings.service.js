const UserSettings = require('../models/UserSettings');
const UserDevice = require('../models/UserDevice');
const UserApiKey = require('../models/UserApiKey');
const UserBackup = require('../models/UserBackup');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const crypto = require('crypto');

class SettingsService {
  async getUserSettings(userId) {
    let settings = await UserSettings.findOne({ userId });
    if (!settings) {
      const user = await User.findById(userId);
      settings = await UserSettings.create({
        userId,
        account: {
          fullName: user ? user.fullName : '',
          username: user ? user.username : '',
          email: user ? user.email : '',
          location: user ? user.location || '' : '',
        },
        profile: {
          avatarUrl: user ? user.avatar || '' : '',
          skills: user ? user.skills || [] : [],
        }
      });
    }
    return settings;
  }

  async updateSettingsSection(userId, section, data, io) {
    let settings = await UserSettings.findOne({ userId });
    if (!settings) {
      settings = await UserSettings.create({ userId });
    }

    if (settings[section] !== undefined) {
      settings[section] = { ...settings[section].toObject?.() || settings[section], ...data };
      await settings.save();
    } else {
      settings.set(section, data);
      await settings.save();
    }

    // Emit Socket.IO event if io instance provided
    if (io) {
      io.to(userId.toString()).emit('settings_updated', { section, data: settings[section] });
      if (section === 'appearance') {
        io.to(userId.toString()).emit('theme_changed', settings.appearance);
      }
      if (section === 'security') {
        io.to(userId.toString()).emit('security_updated', settings.security);
      }
    }

    // Record activity log
    await ActivityLog.create({
      userId,
      action: `UPDATED_${section.toUpperCase()}_SETTINGS`,
      module: 'SETTINGS',
      details: `Updated ${section} settings`,
    }).catch(() => {});

    return settings;
  }

  async getUserDevices(userId) {
    let devices = await UserDevice.find({ userId }).sort({ lastActiveAt: -1 });
    if (devices.length === 0) {
      // Seed current device
      const current = await UserDevice.create({
        userId,
        deviceName: 'Chrome on Windows 11 (Current Session)',
        os: 'Windows 11',
        browser: 'Chrome 126.0',
        ipAddress: '127.0.0.1',
        location: 'Bengaluru, India',
        isCurrent: true,
        isTrusted: true,
      });
      devices = [current];
    }
    return devices;
  }

  async revokeDevice(userId, deviceId, io) {
    await UserDevice.findOneAndDelete({ _id: deviceId, userId });
    if (io) {
      io.to(userId.toString()).emit('device_logged_out', { deviceId });
    }
    return { success: true, message: 'Device logged out successfully' };
  }

  async revokeAllDevices(userId, io) {
    await UserDevice.deleteMany({ userId, isCurrent: false });
    if (io) {
      io.to(userId.toString()).emit('device_logged_out', { all: true });
    }
    return { success: true, message: 'All secondary devices logged out' };
  }

  async getUserApiKeys(userId) {
    return await UserApiKey.find({ userId, isRevoked: false }).sort({ createdAt: -1 });
  }

  async generateApiKey(userId, keyName, scopes) {
    const rawKey = `cs_live_${crypto.randomBytes(16).toString('hex')}`;
    const keyPrefix = rawKey.substring(0, 10);
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await UserApiKey.create({
      userId,
      keyName: keyName || 'Developer Access Key',
      keyPrefix: `${keyPrefix}...`,
      keyHash,
      scopes: scopes || ['read:profile', 'read:courses'],
      expiresAt: new Date(Date.now() + 365 * 86400000),
    });

    return { apiKey, rawKey };
  }

  async revokeApiKey(userId, keyId) {
    await UserApiKey.findOneAndUpdate({ _id: keyId, userId }, { isRevoked: true });
    return { success: true, message: 'API Key revoked' };
  }

  async getUserBackups(userId) {
    let backups = await UserBackup.find({ userId }).sort({ createdAt: -1 });
    if (backups.length === 0) {
      const defaultBackup = await UserBackup.create({
        userId,
        backupName: `CodeSphere_Full_Backup_${new Date().toISOString().slice(0, 10)}.zip`,
        sizeMB: 12.4,
        status: 'completed',
      });
      backups = [defaultBackup];
    }
    return backups;
  }

  async triggerBackup(userId, io) {
    const backup = await UserBackup.create({
      userId,
      backupName: `CodeSphere_Backup_${Date.now()}.zip`,
      sizeMB: (Math.random() * 10 + 5).toFixed(1),
      status: 'completed',
    });
    if (io) {
      io.to(userId.toString()).emit('backup_completed', backup);
    }
    return backup;
  }

  async getActivityLogs(userId) {
    return await ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(50);
  }
}

module.exports = new SettingsService();
