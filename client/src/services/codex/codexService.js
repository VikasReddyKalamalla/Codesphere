import * as codexApi from './codexApi.js';

export const codexService = {
  getCodexData: async () => {
    return await codexApi.fetchCodexDataAPI();
  }
};
export default codexService;
