import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class EventsService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.EVENTS);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.EVENTS + '/update', data);
    return res.data;
  }
}

export default new EventsService();
