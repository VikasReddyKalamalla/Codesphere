/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and DDoS attacks
 */

const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redis = require('redis');

// Create Redis client for distributed rate limiting
let redisClient;
let redisConnected = false;

try {
  // Only connect to Redis when not running tests
  if (process.env.NODE_ENV !== 'test') {
    const redisUrl = (process.env.REDIS_URL && !process.env.REDIS_URL.includes('host:port'))
      ? process.env.REDIS_URL
      : ((process.env.UPSTASH_REDIS_URL && !process.env.UPSTASH_REDIS_URL.includes('host:port'))
        ? process.env.UPSTASH_REDIS_URL
        : 'redis://localhost:6379');
    redisClient = redis.createClient({ url: redisUrl });
    
    redisClient.on('error', (err) => {
      console.error('Redis client error:', err);
      redisConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('✓ Redis connected for rate limiting');
      redisConnected = true;
    });

    // Start connection in background (non-blocking)
    redisClient.connect().catch(err => {
      console.warn('Redis connection failed (non-critical for dev):', err.message);
      redisConnected = false;
    });
  }
} catch (error) {
  console.warn('Redis not available, using in-memory rate limiting. Error:', error.message);
}

/**
 * Helper to create a unique RedisStore for each rate limiter (required by express-rate-limit v7+)
 */
const createRedisStore = (prefix) => {
  if (process.env.NODE_ENV === 'test' || !redisClient || !redisConnected) {
    return undefined; // Falls back to default in-memory store
  }
  return new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: prefix,
  });
};

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // 2000 requests
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  store: createRedisStore('rate-limit-api:'),
  skip: (req) => {
    // Skip rate limiting for health checks and local development/localhost IPs
    if (process.env.NODE_ENV === 'development') return true;
    const ip = req.ip || req.connection?.remoteAddress || '';
    if (ip.includes('127.0.0.1') || ip.includes('::1') || ip.includes('localhost')) return true;
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
  store: createRedisStore('rate-limit-auth:'),
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
  store: createRedisStore('rate-limit-code:'),
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
  store: createRedisStore('rate-limit-upload:'),
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
  store: createRedisStore('rate-limit-payment:'),
  keyGenerator: (req) => req.user?._id || req.ip,
});

module.exports = {
  apiLimiter,
  authLimiter,
  codeLimiter,
  uploadLimiter,
  paymentLimiter,
};
