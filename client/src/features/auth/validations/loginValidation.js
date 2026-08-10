export const validateLogin = (data) => {
  const errors = {};
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address or username is required';
  }
  if (!data.password) {
    errors.password = 'Password is required';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
