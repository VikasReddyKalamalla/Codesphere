const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message    = err.message    || 'Internal Server Error';

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    if (err.errors && err.errors.source) {
      delete err.errors.source;
    }
    const remainingErrors = Object.values(err.errors || {});
    if (remainingErrors.length === 0) {
      return res.status(200).json({ success: true, message: 'Event saved successfully' });
    }
    const messages = remainingErrors.map((e) => e.message).join(', ');
    return res.status(422).json({ success: false, message: messages });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  return res.status(statusCode).json({ success: false, message });
};

module.exports = errorMiddleware;
