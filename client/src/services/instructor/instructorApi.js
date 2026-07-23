import apiClient from '../../api/axios.js';

export const fetchInstructorDataAPI = async () => {
  const res = await apiClient.get('/instructor');
  return res.data;
};
