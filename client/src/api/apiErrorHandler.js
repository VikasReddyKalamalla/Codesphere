import toast from 'react-hot-toast';

export const handleApiError = (error) => {
  if (!error.response) {
    toast.error('Network Error: Please check your connection.');
    return Promise.reject(error);
  }
  const { status, data } = error.response;
  const message = data?.message || 'Request failed';
  switch (status) {
    case 400:
      toast.error(`Bad Request: ${message}`);
      break;
    case 401:
      toast.error(`Unauthorized: ${message}`);
      localStorage.clear();
      break;
    case 403:
      toast.error(`Forbidden: ${message}`);
      break;
    case 404:
      toast.error(`Not Found: ${message}`);
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
