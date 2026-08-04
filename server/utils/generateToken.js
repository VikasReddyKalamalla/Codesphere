const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a given user.
 * Payload includes id and role so middleware can authorise without a DB lookup.
 *
 * @param   {Object} user  - Mongoose User document
 * @returns {String}       - Signed JWT string
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id:    user._id ? String(user._id) : undefined,
      role:  user.role,
      email: user.email,
    },
    process.env.JWT_SECRET || 'codesphere_secret_key_2025',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

module.exports = generateToken;
