import * as testsApi from './testsApi.js';

export const testsService = {
  getTestsData: async () => {
    return await testsApi.fetchTestsDataAPI();
  }
};
export default testsService;
