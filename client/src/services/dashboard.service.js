import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class DashboardService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.DASHBOARD);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.DASHBOARD + '/update', data);
    return res.data;
  }
}

export default new DashboardService();
