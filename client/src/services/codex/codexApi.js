import apiClient from '../../api/axios.js';

export const fetchCodexDataAPI = async () => {
  const res = await apiClient.get('/codex');
  return res.data;
};
