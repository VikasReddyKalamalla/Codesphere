import apiClient from '../../api/axios.js';

export const fetchNotificationsDataAPI = async () => {
  const res = await apiClient.get('/notifications');
  return res.data;
};
