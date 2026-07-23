import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class SubscriptionService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.SUBSCRIPTION);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.SUBSCRIPTION + '/update', data);
    return res.data;
  }
}

export default new SubscriptionService();
