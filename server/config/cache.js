/**
 * Caching Layer Configuration
 * Redis-based caching for performance optimization
 */

const redis = require('redis');
const logger = require('../utils/logger');

let redisClient;

/**
 * Initialize Redis client for caching
 */
const initCache = async () => {
  try {
    const redisUrl = (process.env.REDIS_URL && !process.env.REDIS_URL.includes('host:port'))
      ? process.env.REDIS_URL
      : ((process.env.UPSTASH_REDIS_URL && !process.env.UPSTASH_REDIS_URL.includes('host:port'))
        ? process.env.UPSTASH_REDIS_URL
        : 'redis://localhost:6379');
    
    redisClient = redis.createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            return new Error('Redis max retries exceeded');
          }
          return Math.min(retries * 100, 1000);
        },
      },
    });

    redisClient.on('error', (err) => {
      logger.warn(`Redis cache warning: ${err.message}`);
    });

    redisClient.on('connect', () => {
      logger.info('✓ Redis connected for caching');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.warn(`Redis cache initialization failed: ${error.message}. Using in-memory cache.`);
    return createMemoryCache();
  }
};

/**
 * Get value from cache
 */
const get = async (key) => {
  try {
    if (!redisClient) return null;
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error(`Cache get error: ${error.message}`);
    return null;
  }
};

/**
 * Set value in cache with TTL
 */
const set = async (key, value, ttl = 3600) => {
  try {
    if (!redisClient) return false;
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error(`Cache set error: ${error.message}`);
    return false;
  }
};

/**
 * Delete value from cache
 */
const del = async (key) => {
  try {
    if (!redisClient) return false;
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Cache delete error: ${error.message}`);
    return false;
  }
};

/**
 * Clear all cache (use with caution)
 */
const clear = async () => {
  try {
    if (!redisClient) return false;
    await redisClient.flushAll();
    logger.info('Cache cleared');
    return true;
  } catch (error) {
    logger.error(`Cache clear error: ${error.message}`);
    return false;
  }
};

/**
 * In-memory cache fallback
 */
const createMemoryCache = () => {
  const cache = new Map();
  return {
    get: async (key) => cache.get(key) || null,
    set: async (key, value, ttl = 3600) => {
      cache.set(key, value);
      setTimeout(() => cache.delete(key), ttl * 1000);
      return true;
    },
    del: async (key) => cache.delete(key),
    flushAll: async () => cache.clear(),
  };
};

/**
 * Cache middleware factory
 */
const cacheMiddleware = (duration = 3600) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `route:${req.originalUrl}`;
    const cachedData = await get(key);

    if (cachedData) {
      logger.info(`Cache hit: ${key}`);
      return res.json(cachedData);
    }

    // Intercept res.json to cache response
    const originalJson = res.json;
    res.json = function (data) {
      set(key, data, duration).catch((err) => logger.error(`Failed to cache: ${err}`));
      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Specific cache keys for common queries
 */
const cacheKeys = {
  SANDBOX_PROJECTS: 'projects:all',
  SANDBOX_PROJECT: (id) => `projects:${id}`,
  USER_PROGRESS: (userId, projectId) => `progress:${userId}:${projectId}`,
  USER_NOTIFICATIONS: (userId) => `notifications:${userId}`,
  LANGUAGES: 'languages:all',
  LEADERBOARD: 'leaderboard:global',
};

module.exports = {
  initCache,
  get,
  set,
  del,
  clear,
  cacheMiddleware,
  cacheKeys,
};
