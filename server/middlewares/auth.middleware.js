const jwt            = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');
const User           = require('../models/User');

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

    // 2. Verify token using consistent secret fallback
    const secret = process.env.JWT_SECRET || 'codesphere_secret_key_2025';
    const decoded = jwt.verify(token, secret);

    // 3. Fetch user — password excluded via schema select:false
    const userId = decoded.id || decoded._id;
    const user = await User.findById(userId);
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
    console.warn('[Auth Middleware 401]:', error.message);
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Session expired. Please log in again.');
    }
    return errorResponse(res, 401, `Invalid token: ${error.message}`);
  }
};

/**
 * optionalAuth — attempts to decode Bearer JWT in Authorization header if present.
 * If valid, attaches req.user. If invalid or missing, continues without error.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'codesphere_jwt_secret');
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore error for optional auth
  }
  next();
};

module.exports = { protect, optionalAuth };

