const jwt            = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

// Determine which database to use
let User;
const USE_MOCK_DB = process.env.NODE_ENV === 'development';

if (USE_MOCK_DB) {
  User = require('../services/mockDatabase');
} else {
  try {
    User = require('../models/User');
  } catch (err) {
    User = require('../services/mockDatabase');
  }
}

/**
 * protect — verifies the Bearer JWT in Authorization header.
 * Attaches the full user document (without password) to req.user.
 */
const protect = async (req, res, next) => {
  try {
    // 1. Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch user — password excluded via schema select:false
    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 401, 'User belonging to this token no longer exists.');
    }

    // 4. Check if account is still active
    if (!user.isActive) {
      return errorResponse(res, 403, 'Your account has been deactivated.');
    }

    // 5. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Session expired. Please log in again.');
    }
    return errorResponse(res, 401, 'Invalid token. Please log in again.');
  }
};

module.exports = { protect };
