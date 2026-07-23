import apiClient from '@services/axios.js';

export const fetchCoursesAPI       = async (params = {}) => (await apiClient.get('/learning', { params })).data;
export const fetchCourseDetailsAPI = async (id)          => (await apiClient.get(`/learning/${id}`)).data;
export const fetchAllProgressAPI   = async ()             => (await apiClient.get('/learning/progress')).data;
export const fetchPathProgressAPI  = async (pathId)      => (await apiClient.get(`/learning/progress/${pathId}`)).data;
export const markLessonCompleteAPI = async (lessonId, unmark)    => (await apiClient.post('/learning/progress', { lessonId, unmark })).data;
export const enrollAPI             = async (pathId)      => (await apiClient.post(`/learning/${pathId}/enroll`)).data;
export const unenrollAPI           = async (pathId)      => (await apiClient.delete(`/learning/${pathId}/enroll`)).data;
