import {
  fetchSettingsAPI,
  updateSettingsSectionAPI,
  fetchDevicesAPI,
  revokeDeviceAPI,
  revokeAllDevicesAPI,
  fetchApiKeysAPI,
  generateApiKeyAPI,
  revokeApiKeyAPI,
  fetchBackupsAPI,
  triggerBackupAPI,
  fetchActivityLogsAPI,
} from '../services/settingsAPI';

import {
  setSettings,
  updateSectionState,
  setDevices,
  setApiKeys,
  setBackups,
  setActivityLogs,
  setLoading,
  setSaving,
  setSuccessMessage,
} from './settingsSlice';

export const loadUserSettingsThunk = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await fetchSettingsAPI();
    if (res.data?.data) {
      dispatch(setSettings(res.data.data));
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  } finally {
    dispatch(setLoading(false));
  }
};

import { updateUser } from '@features/auth/redux/authSlice.js';

export const saveSettingsSectionThunk = (section, data) => async (dispatch) => {
  dispatch(setSaving(true));
  try {
    dispatch(updateSectionState({ section, data }));
    await updateSettingsSectionAPI(section, data);
    if (section === 'account') {
      dispatch(updateUser(data));
    }
    dispatch(setSuccessMessage(`${section.toUpperCase()} preferences saved!`));
    setTimeout(() => dispatch(setSuccessMessage(null)), 3000);
  } catch (err) {
    console.error(`Failed to save ${section} settings:`, err);
  } finally {
    dispatch(setSaving(false));
  }
};

export const fetchDevicesThunk = () => async (dispatch) => {
  try {
    const res = await fetchDevicesAPI();
    dispatch(setDevices(res.data.data));
  } catch (err) {
    console.error('Failed to fetch devices:', err);
  }
};

export const revokeDeviceThunk = (deviceId) => async (dispatch) => {
  try {
    await revokeDeviceAPI(deviceId);
    dispatch(fetchDevicesThunk());
  } catch (err) {
    console.error('Failed to revoke device:', err);
  }
};

export const revokeAllDevicesThunk = () => async (dispatch) => {
  try {
    await revokeAllDevicesAPI();
    dispatch(fetchDevicesThunk());
  } catch (err) {
    console.error('Failed to revoke all devices:', err);
  }
};

export const fetchApiKeysThunk = () => async (dispatch) => {
  try {
    const res = await fetchApiKeysAPI();
    dispatch(setApiKeys(res.data.data));
  } catch (err) {
    console.error('Failed to fetch API keys:', err);
  }
};

export const generateApiKeyThunk = (data) => async (dispatch) => {
  try {
    const res = await generateApiKeyAPI(data);
    dispatch(fetchApiKeysThunk());
    return res.data.data;
  } catch (err) {
    console.error('Failed to generate API key:', err);
  }
};

export const revokeApiKeyThunk = (keyId) => async (dispatch) => {
  try {
    await revokeApiKeyAPI(keyId);
    dispatch(fetchApiKeysThunk());
  } catch (err) {
    console.error('Failed to revoke API key:', err);
  }
};

export const fetchBackupsThunk = () => async (dispatch) => {
  try {
    const res = await fetchBackupsAPI();
    dispatch(setBackups(res.data.data));
  } catch (err) {
    console.error('Failed to fetch backups:', err);
  }
};

export const triggerBackupThunk = () => async (dispatch) => {
  try {
    await triggerBackupAPI();
    dispatch(fetchBackupsThunk());
  } catch (err) {
    console.error('Failed to trigger backup:', err);
  }
};

export const fetchActivityLogsThunk = () => async (dispatch) => {
  try {
    const res = await fetchActivityLogsAPI();
    dispatch(setActivityLogs(res.data.data));
  } catch (err) {
    console.error('Failed to fetch activity logs:', err);
  }
};
