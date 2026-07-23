import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class NotificationsService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.NOTIFICATIONS + '/update', data);
    return res.data;
  }
}

export default new NotificationsService();
