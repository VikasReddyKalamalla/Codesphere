/**
 * Security & Input Sanitization Middleware
 * Provides NoSQL query injection protection, XSS sanitization, and security headers.
 */

const logger = require('../utils/logger');

/**
 * Recursively strip keys starting with '$' or containing '.' to prevent NoSQL injection
 */
const cleanNoSQLKeys = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(cleanNoSQLKeys);
  }

  const cleaned = {};
  for (const key of Object.keys(obj)) {
    // Strip keys starting with $ or containing .
    if (key.startsWith('$') || key.includes('.')) {
      logger.warn(`[Security Warning] Stripped forbidden NoSQL operator key: "${key}"`);
      continue;
    }
    cleaned[key] = cleanNoSQLKeys(obj[key]);
  }
  return cleaned;
};

/**
 * Middleware: NoSQL Injection Guard
 */
const sanitizeNoSQL = (req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = cleanNoSQLKeys(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      req.query = cleanNoSQLKeys(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      req.params = cleanNoSQLKeys(req.params);
    }
    next();
  } catch (err) {
    logger.error(`NoSQL sanitization error: ${err.message}`);
    next();
  }
};

/**
 * Strip dangerous HTML script tags and inline event handlers from strings
 */
const cleanXSSString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

const cleanXSSObj = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return typeof obj === 'string' ? cleanXSSString(obj) : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanXSSObj);
  }
  const cleaned = {};
  for (const key of Object.keys(obj)) {
    cleaned[key] = cleanXSSObj(obj[key]);
  }
  return cleaned;
};

/**
 * Middleware: XSS Sanitization Guard
 */
const sanitizeXSS = (req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = cleanXSSObj(req.body);
    }
    next();
  } catch (err) {
    logger.error(`XSS sanitization error: ${err.message}`);
    next();
  }
};

/**
 * Middleware: Hardened Security Headers
 */
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
};

module.exports = {
  sanitizeNoSQL,
  sanitizeXSS,
  securityHeaders,
};
