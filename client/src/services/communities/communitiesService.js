import * as communitiesApi from './communitiesApi.js';

export const communitiesService = {
  getCommunitiesData: async () => {
    return await communitiesApi.fetchCommunitiesDataAPI();
  }
};
export default communitiesService;
