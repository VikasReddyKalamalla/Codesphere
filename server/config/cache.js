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

let stats = {
  hits: 0,
  misses: 0,
  sets: 0,
  deletes: 0,
};

/**
 * Get value from cache
 */
const get = async (key) => {
  try {
    if (!redisClient) return null;
    const value = await redisClient.get(key);
    if (value) {
      stats.hits++;
      return JSON.parse(value);
    }
    stats.misses++;
    return null;
  } catch (error) {
    logger.error(`Cache get error: ${error.message}`);
    stats.misses++;
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
    stats.sets++;
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
    stats.deletes++;
    return true;
  } catch (error) {
    logger.error(`Cache delete error: ${error.message}`);
    return false;
  }
};

/**
 * Delete values from cache matching a pattern
 */
const delByPattern = async (pattern) => {
  try {
    if (!redisClient || !redisClient.isOpen) return false;
    const keys = await redisClient.keys(pattern);
    if (keys && keys.length > 0) {
      await redisClient.del(keys);
      stats.deletes += keys.length;
    }
    return true;
  } catch (error) {
    logger.error(`Cache delByPattern error: ${error.message}`);
    return false;
  }
};

/**
 * Invalidate route caches matching patterns
 */
const invalidateRoutes = async (patterns = ['route:*']) => {
  let count = 0;
  for (const pattern of patterns) {
    await delByPattern(pattern);
    count++;
  }
  return count;
};

/**
 * Get real-time cache statistics
 */
const getCacheStats = () => {
  const total = stats.hits + stats.misses;
  const hitRatio = total > 0 ? ((stats.hits / total) * 100).toFixed(2) : '0.00';
  return {
    ...stats,
    totalRequests: total,
    hitRatioPercent: `${hitRatio}%`,
    isConnected: !!(redisClient && redisClient.isOpen),
    clientType: redisClient ? 'Redis' : 'MemoryFallback',
  };
};

// In-memory locks map to prevent Thundering Herd on single node
const activeLocks = new Map();

/**
 * Get cached value or execute fetchFn with mutex lock to prevent cache stampedes
 */
const getOrSetWithLock = async (key, fetchFn, ttl = 3600) => {
  const cached = await get(key);
  if (cached) return cached;

  if (activeLocks.has(key)) {
    // Wait for active lock to finish
    await activeLocks.get(key);
    return (await get(key)) || (await fetchFn());
  }

  let resolveLock;
  const lockPromise = new Promise((res) => { resolveLock = res; });
  activeLocks.set(key, lockPromise);

  try {
    const freshData = await fetchFn();
    if (freshData !== undefined && freshData !== null) {
      await set(key, freshData, ttl);
    }
    return freshData;
  } finally {
    activeLocks.delete(key);
    resolveLock();
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
    get: async (key) => {
      const val = cache.get(key);
      if (val) stats.hits++; else stats.misses++;
      return val || null;
    },
    set: async (key, value, ttl = 3600) => {
      cache.set(key, value);
      stats.sets++;
      setTimeout(() => cache.delete(key), ttl * 1000);
      return true;
    },
    del: async (key) => {
      stats.deletes++;
      return cache.delete(key);
    },
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
  DSA_TOPICS: 'dsa:topics:all',
  DSA_ROADMAP: 'dsa:roadmap:striver',
  TECH_ROADMAPS: 'roadmaps:all',
};

module.exports = {
  initCache,
  get,
  set,
  del,
  delByPattern,
  invalidateRoutes,
  getCacheStats,
  getOrSetWithLock,
  clear,
  cacheMiddleware,
  cacheKeys,
};
