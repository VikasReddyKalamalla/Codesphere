import apiClient from './axios.js';
import { API_ENDPOINTS } from './api.js';

class InstructorService {
  async getSummary() {
    const res = await apiClient.get(API_ENDPOINTS.INSTRUCTOR);
    return res.data;
  }
  async updateDetails(data) {
    const res = await apiClient.put(API_ENDPOINTS.INSTRUCTOR + '/update', data);
    return res.data;
  }
}

export default new InstructorService();
