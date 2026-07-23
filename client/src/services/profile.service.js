import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class ProfileService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.PROFILE);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.PROFILE + '/update', data);
    return res.data;
  }
}

export default new ProfileService();
