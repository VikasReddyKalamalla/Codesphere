import * as learningApi from './learningApi.js';

export const learningService = {
  getLearningData: async () => {
    return await learningApi.fetchLearningDataAPI();
  }
};
export default learningService;
