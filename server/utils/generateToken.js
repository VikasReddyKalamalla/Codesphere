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
      id:   user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

module.exports = generateToken;
