import * as resourcesApi from './resourcesApi.js';

export const resourcesService = {
  getResourcesData: async () => {
    return await resourcesApi.fetchResourcesDataAPI();
  }
};
export default resourcesService;
