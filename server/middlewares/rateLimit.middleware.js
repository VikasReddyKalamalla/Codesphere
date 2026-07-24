/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and DDoS attacks
 */

const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

// Create Redis client for distributed rate limiting
let redisClient;
let store;

try {
  const redisUrl = process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379';
  redisClient = redis.createClient({ url: redisUrl });
  
  redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
  });

  redisClient.connect();

  // Use Redis store for rate limiting (useful for multiple server instances)
  store = new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:',
  });
} catch (error) {
  console.warn('Redis not available, using in-memory rate limiting');
  // Falls back to memory store if Redis is unavailable
}

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  store: store,
  skip: (req) => {
    // Skip rate limiting for health checks and public routes
    return req.path === '/health' || req.path === '/';
  },
  keyGenerator: (req) => {
    // Use user ID for authenticated users, IP for others
    return req.user ? `user:${req.user._id}` : req.ip;
  },
});

/**
 * Strict rate limiter for authentication
 * 5 attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
});

/**
 * Code execution limiter
 * 10 requests per minute per user
 */
const codeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many code execution requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
  keyGenerator: (req) => req.user?._id || req.ip,
});

/**
 * File upload limiter
 * 20 uploads per hour per user
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many file uploads, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
  keyGenerator: (req) => req.user?._id || req.ip,
});

/**
 * Payment limiter
 * 5 payment attempts per hour per user
 */
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many payment attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
  keyGenerator: (req) => req.user?._id || req.ip,
});

module.exports = {
  apiLimiter,
  authLimiter,
  codeLimiter,
  uploadLimiter,
  paymentLimiter,
};
