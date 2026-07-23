import * as authApi from './authApi.js';

export const authService = {
  getAuthData: async () => {
    return await authApi.fetchAuthDataAPI();
  }
};
export default authService;
