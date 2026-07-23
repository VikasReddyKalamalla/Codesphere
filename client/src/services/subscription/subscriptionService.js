import * as subscriptionApi from './subscriptionApi.js';

export const subscriptionService = {
  getSubscriptionData: async () => {
    return await subscriptionApi.fetchSubscriptionDataAPI();
  }
};
export default subscriptionService;
