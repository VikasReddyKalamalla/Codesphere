import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class LearningService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.LEARNING);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.LEARNING + '/update', data);
    return res.data;
  }
}

export default new LearningService();
