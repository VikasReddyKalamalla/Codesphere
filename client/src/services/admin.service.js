import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class AdminService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.ADMIN);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.ADMIN + '/update', data);
    return res.data;
  }
}

export default new AdminService();
