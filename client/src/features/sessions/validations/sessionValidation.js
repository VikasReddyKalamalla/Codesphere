export const validateSession = (data) => {
  const errors = {};
  if (!data.title) errors.title = 'Title is required';
  if (!data.date) errors.date = 'Date/Time is required';
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
