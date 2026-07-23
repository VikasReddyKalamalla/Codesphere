import * as notificationsApi from './notificationsApi.js';

export const notificationsService = {
  getNotificationsData: async () => {
    return await notificationsApi.fetchNotificationsDataAPI();
  }
};
export default notificationsService;
