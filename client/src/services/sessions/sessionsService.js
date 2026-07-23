import * as sessionsApi from './sessionsApi.js';

export const sessionsService = {
  getSessionsData: async () => {
    return await sessionsApi.fetchSessionsDataAPI();
  }
};
export default sessionsService;
