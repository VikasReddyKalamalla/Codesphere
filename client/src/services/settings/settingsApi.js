import apiClient from '../../api/axios.js';

export const fetchSettingsDataAPI = async () => {
  const res = await apiClient.get('/settings');
  return res.data;
};
