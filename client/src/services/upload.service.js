import apiClient from './axios.js';

class UploadService {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
}
export default new UploadService();
