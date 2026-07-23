import * as settingsApi from './settingsApi.js';

export const settingsService = {
  getSettingsData: async () => {
    return await settingsApi.fetchSettingsDataAPI();
  }
};
export default settingsService;
