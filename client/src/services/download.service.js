import apiClient from './axios.js';

class DownloadService {
  async downloadFile(url) {
    const res = await apiClient.get(url, { responseType: 'blob' });
    return res.data;
  }
}
export default new DownloadService();
