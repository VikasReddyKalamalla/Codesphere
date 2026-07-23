import * as sandboxApi from './sandboxApi.js';

export const sandboxService = {
  getSandboxData: async () => {
    return await sandboxApi.fetchSandboxDataAPI();
  }
};
export default sandboxService;
