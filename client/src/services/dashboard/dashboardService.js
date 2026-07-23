import * as dashboardApi from './dashboardApi.js';

export const dashboardService = {
  getDashboardData: async () => {
    return await dashboardApi.fetchDashboardDataAPI();
  }
};
export default dashboardService;
