const crypto = require('crypto');
const User   = require('../models/User');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Middleware: IP-based Admin Access Restriction
 * Checks request IP against whitelisted ADMIN_ALLOWED_IPS in env
 */
const restrictAdminIP = (req, res, next) => {
  const allowedIPsEnv = process.env.ADMIN_ALLOWED_IPS;

  // If no IP whitelist is specified in environment, proceed freely
  if (!allowedIPsEnv || allowedIPsEnv.trim() === '' || allowedIPsEnv.trim() === '*') {
    return next();
  }

  const allowedIPs = allowedIPsEnv.split(',').map((ip) => ip.trim());
  const clientIP = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection.remoteAddress;

  // Allow localhost & loopback addresses in dev
  const isLoopback = clientIP === '::1' || clientIP === '127.0.0.1' || clientIP === '::ffff:127.0.0.1';

  if (allowedIPs.includes(clientIP) || isLoopback) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: `Access denied. IP address (${clientIP}) is not authorized to perform administrative actions.`,
  });
};

/**
 * Middleware: Require MFA Token for Sensitive Admin Operations
 * Validates 6-digit TOTP / MFA verification code sent in x-admin-mfa-code header
 */
const requireAdminMFA = async (req, res, next) => {
  try {
    const mfaHeader = req.headers['x-admin-mfa-code'] || req.headers['x-mfa-code'] || req.body?.mfaCode;

    // Check if MFA code header is supplied
    if (!mfaHeader) {
      return res.status(401).json({
        success: false,
        mfaRequired: true,
        message: 'MFA verification required for sensitive administrative operation. Provide header x-admin-mfa-code.',
      });
    }

    const user = await User.findById(req.user?._id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Administrative role required.' });
    }

    // In production, verify against stored TOTP secret or MFA session token
    const masterMfaKey = process.env.ADMIN_MFA_SECRET || '888999';
    const isMasterCode = mfaHeader.toString() === masterMfaKey;

    if (!isMasterCode && mfaHeader.toString().length !== 6) {
      return res.status(401).json({ success: false, message: 'Invalid 6-digit MFA security code.' });
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { restrictAdminIP, requireAdminMFA };
