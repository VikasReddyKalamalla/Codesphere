import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class CodexService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.CODEX);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.CODEX + '/update', data);
    return res.data;
  }
}

export default new CodexService();
