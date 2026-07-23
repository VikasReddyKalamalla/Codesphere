import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class SessionsService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.SESSIONS);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.SESSIONS + '/update', data);
    return res.data;
  }
}

export default new SessionsService();
