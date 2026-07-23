import * as adminApi from './adminApi.js';

export const adminService = {
  getAdminData: async () => {
    return await adminApi.fetchAdminDataAPI();
  }
};
export default adminService;
