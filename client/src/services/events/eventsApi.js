import apiClient from '../../api/axios.js';

export const fetchEventsDataAPI = async () => {
  const res = await apiClient.get('/events');
  return res.data;
};
