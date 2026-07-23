import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class CommunitiesService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.COMMUNITIES);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.COMMUNITIES + '/update', data);
    return res.data;
  }
}

export default new CommunitiesService();
