import toast from 'react-hot-toast';

export const handleApiError = (error) => {
  if (error.config?.suppressErrorToast) {
    return Promise.reject(error);
  }
  if (!error.response) {
    toast.error('Network Error: Please check your connection.');
    return Promise.reject(error);
  }
  const { status, data } = error.response;
  const message = data?.message || 'Request failed';
  const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');

  switch (status) {
    case 400:
      if (!isAuthRequest) toast.error(`Bad Request: ${message}`);
      break;
    case 401:
      if (!isAuthRequest) {
        toast.error(`Unauthorized: ${message}`);
        localStorage.removeItem('codesphere_token');
      }
      break;
    case 403:
      if (!isAuthRequest) toast.error(`Forbidden: ${message}`);
      break;
    case 404:
      if (!isAuthRequest) toast.error(`Not Found: ${message}`);
      break;
    case 409:
      toast.error(`Conflict: ${message}`);
      break;
    case 422:
      toast.error(`Validation Error: ${message}`);
      break;
    case 500:
      toast.error('Internal Server Error. Please try again later.');
      break;
    default:
      toast.error(message);
  }
  return Promise.reject(error);
};
