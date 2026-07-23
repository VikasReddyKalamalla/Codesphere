import * as eventsApi from './eventsApi.js';

export const eventsService = {
  getEventsData: async () => {
    return await eventsApi.fetchEventsDataAPI();
  }
};
export default eventsService;
