export const validateLogin = (data) => {
  const errors = {};
  if (!data.email) {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Invalid email address format';
  }
  if (!data.password) {
    errors.password = 'Password is required';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
