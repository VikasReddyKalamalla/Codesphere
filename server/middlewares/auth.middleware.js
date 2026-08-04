const jwt            = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

const mongoose = require('mongoose');

function getUserModel() {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return require('../models/User');
  }
  return require('../services/mockDatabase');
}

/**
 * protect — verifies the Bearer JWT in Authorization header.
 * Attaches the full user document to req.user.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'codesphere_secret_key_2025';
    const decoded = jwt.verify(token, secret);

    const model = getUserModel();
    const mockDB = require('../services/mockDatabase');
    let user = null;
    const userId = decoded.id || decoded._id;

    // 1. Try Mongoose model if Mongo is connected
    if (mongoose.connection && mongoose.connection.readyState === 1 && userId) {
      user = await model.findById(userId).catch(() => null);
    }

    // 2. Try Mock DB by ID
    if (!user && userId) {
      user = await mockDB.findById(String(userId)).catch(() => null);
    }

    // 3. Try searching by email
    if (!user && decoded.email) {
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        user = await model.findOne({ email: decoded.email.toLowerCase() }).catch(() => null);
      }
      if (!user) {
        user = await mockDB.findOne({ email: decoded.email.toLowerCase() }).catch(() => null);
      }
    }

    if (!user) {
      return errorResponse(res, 401, 'User belonging to this token no longer exists.');
    }

    if (user.isActive === false) {
      return errorResponse(res, 403, 'Your account has been deactivated.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Session expired. Please log in again.');
    }
    return errorResponse(res, 401, 'Invalid token. Please log in again.');
  }
};

/**
 * optionalAuth — attempts to decode Bearer JWT if provided, but does NOT block if token is missing/invalid.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'codesphere_secret_key_2025';
    const decoded = jwt.verify(token, secret);

    const model = getUserModel();
    const mockDB = require('../services/mockDatabase');
    let user = null;
    const userId = decoded.id || decoded._id;

    if (mongoose.connection && mongoose.connection.readyState === 1 && userId) {
      user = await model.findById(userId).catch(() => null);
    }
    if (!user && userId) {
      user = await mockDB.findById(String(userId)).catch(() => null);
    }
    if (!user && decoded.email) {
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        user = await model.findOne({ email: decoded.email.toLowerCase() }).catch(() => null);
      }
      if (!user) {
        user = await mockDB.findOne({ email: decoded.email.toLowerCase() }).catch(() => null);
      }
    }

    if (user && user.isActive !== false) {
      req.user = user;
    }
  } catch (error) {
    // Silently proceed for optional auth
  }
  next();
};

module.exports = { protect, optionalAuth };

