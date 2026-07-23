import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class SandboxService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.SANDBOX);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.SANDBOX + '/update', data);
    return res.data;
  }
}

export default new SandboxService();
