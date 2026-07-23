import apiClient from '../../api/axios.js';

export const fetchAuthDataAPI = async () => {
  const res = await apiClient.get('/auth');
  return res.data;
};
