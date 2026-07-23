import apiClient from '../../api/axios.js';

export const fetchSandboxDataAPI = async () => {
  const res = await apiClient.get('/sandbox');
  return res.data;
};
