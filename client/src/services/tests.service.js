import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class TestsService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.TESTS);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.TESTS + '/update', data);
    return res.data;
  }
}

export default new TestsService();
