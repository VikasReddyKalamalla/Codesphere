import * as instructorApi from './instructorApi.js';

export const instructorService = {
  getInstructorData: async () => {
    return await instructorApi.fetchInstructorDataAPI();
  }
};
export default instructorService;
