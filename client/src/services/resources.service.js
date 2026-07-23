import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class ResourcesService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.RESOURCES);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.RESOURCES + '/update', data);
    return res.data;
  }
}

export default new ResourcesService();
