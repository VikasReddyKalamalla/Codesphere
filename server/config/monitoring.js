/**
 * Monitoring & Error Tracking Configuration
 * Integrates Sentry for error tracking and performance monitoring
 */

const logger = require('../utils/logger');

/**
 * Initialize Sentry for error tracking
 */
const initSentry = (app) => {
  try {
    if (!process.env.SENTRY_DSN) {
      logger.warn('SENTRY_DSN not configured, skipping Sentry initialization');
      return;
    }

    const Sentry = require('@sentry/node');
    const Tracing = require('@sentry/tracing');

    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({
          app: true,
          request: true,
          transaction: 'METHOD_and_URL_and_QUERY_PARAMS',
        }),
      ],
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      profilesSampleRate: 0.1,
    });

    // Attach Sentry to Express
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());

    logger.info('✓ Sentry error tracking initialized');
    return Sentry;
  } catch (error) {
    logger.error(`Failed to initialize Sentry: ${error.message}`);
  }
};

/**
 * Attach Sentry error handler to Express
 */
const attachSentryErrorHandler = (app) => {
  try {
    const Sentry = require('@sentry/node');
    app.use(Sentry.Handlers.errorHandler());
    logger.info('✓ Sentry error handler attached');
  } catch (error) {
    logger.error(`Failed to attach Sentry error handler: ${error.message}`);
  }
};

/**
 * Initialize Datadog APM (optional, alternative to Sentry)
 */
const initDatadog = () => {
  try {
    if (!process.env.DATADOG_API_KEY) {
      return;
    }

    // Note: Datadog APM requires the Datadog agent running separately
    // Install with: npm install dd-trace
    const tracer = require('dd-trace').init();
    logger.info('✓ Datadog APM initialized');
    return tracer;
  } catch (error) {
    logger.error(`Failed to initialize Datadog: ${error.message}`);
  }
};

/**
 * Health check endpoint data
 */
const getHealthStatus = async (db) => {
  try {
    const dbStatus = db?.connection?.readyState === 1 ? 'connected' : 'disconnected';
    const uptime = process.uptime();
    const memory = process.memoryUsage();

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      database: dbStatus,
      memory: {
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + ' MB',
        rss: Math.round(memory.rss / 1024 / 1024) + ' MB',
      },
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };
  } catch (error) {
    logger.error(`Health check error: ${error.message}`);
    return { status: 'unhealthy', error: error.message };
  }
};

/**
 * Performance monitoring middleware
 */
const performanceMonitoring = (req, res, next) => {
  const startTime = Date.now();

  // Hook into response finish to measure request time
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const method = req.method;
    const url = req.originalUrl;
    const statusCode = res.statusCode;

    // Log slow requests (> 1000ms)
    if (duration > 1000) {
      logger.warn(`SLOW REQUEST: ${method} ${url} - ${duration}ms (${statusCode})`);
    }

    // Log request in development mode
    if (process.env.NODE_ENV === 'development') {
      logger.info(`${method} ${url} - ${statusCode} - ${duration}ms`);
    }
  });

  next();
};

/**
 * Track API metrics
 */
const trackMetrics = {
  requests: 0,
  errors: 0,
  startTime: Date.now(),

  incrementRequests() {
    this.requests++;
  },

  incrementErrors() {
    this.errors++;
  },

  getMetrics() {
    const uptime = Date.now() - this.startTime;
    return {
      totalRequests: this.requests,
      totalErrors: this.errors,
      errorRate: ((this.errors / this.requests) * 100).toFixed(2) + '%',
      uptime: Math.floor(uptime / 1000) + 's',
    };
  },
};

module.exports = {
  initSentry,
  attachSentryErrorHandler,
  initDatadog,
  getHealthStatus,
  performanceMonitoring,
  trackMetrics,
};
