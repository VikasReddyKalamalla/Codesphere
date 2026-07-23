import apiClient from '@services/axios.js';
export const fetchInstructorStatsAPI = async () => {
  const res = await apiClient.get('/instructor/summary');
  return res.data;
};
