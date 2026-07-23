import apiClient from '@services/axios.js';

export const fetchSettingsAPI = () => apiClient.get('/settings');
export const updateSettingsSectionAPI = (section, data) => apiClient.put(`/settings/section/${section}`, data);
export const fetchDevicesAPI = () => apiClient.get('/settings/devices');
export const revokeDeviceAPI = (deviceId) => apiClient.delete(`/settings/devices/${deviceId}`);
export const revokeAllDevicesAPI = () => apiClient.post('/settings/devices/logout-all');
export const fetchApiKeysAPI = () => apiClient.get('/settings/api-keys');
export const generateApiKeyAPI = (data) => apiClient.post('/settings/api-keys', data);
export const revokeApiKeyAPI = (keyId) => apiClient.delete(`/settings/api-keys/${keyId}`);
export const fetchBackupsAPI = () => apiClient.get('/settings/backups');
export const triggerBackupAPI = () => apiClient.post('/settings/backups');
export const fetchActivityLogsAPI = () => apiClient.get('/settings/activity-logs');
export const exportUserDataAPI = () => apiClient.get('/settings/export-data', { responseType: 'blob' });
