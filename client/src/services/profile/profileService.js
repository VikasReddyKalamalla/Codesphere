import * as profileApi from './profileApi.js';

export const profileService = {
  getProfileData: async () => {
    return await profileApi.fetchProfileDataAPI();
  }
};
export default profileService;
