import apiClient from '../../api/axios.js';

export const fetchSessionsDataAPI = async () => {
  const res = await apiClient.get('/sessions');
  return res.data;
};
