import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class AuthService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.AUTH);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.AUTH + '/update', data);
    return res.data;
  }
}

export default new AuthService();
