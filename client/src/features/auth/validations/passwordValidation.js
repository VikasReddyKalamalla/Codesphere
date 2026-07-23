export const validatePasswordStrength = (pass) => {
  if (!pass) return 0;
  let score = 0;
  if (pass.length > 5) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score; // returns 0-4
};
