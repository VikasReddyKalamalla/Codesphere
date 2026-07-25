/**
 * SSL/TLS Certificate Configuration
 * For HTTPS and custom domain support
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const logger = require('../utils/logger');

/**
 * Load SSL certificates
 */
const loadSSLCertificates = () => {
  const certPath = process.env.SSL_CERT_PATH || './ssl/cert.pem';
  const keyPath = process.env.SSL_KEY_PATH || './ssl/key.pem';

  try {
    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      logger.warn(`SSL certificates not found at ${certPath} and ${keyPath}`);
      logger.warn('Running in HTTP mode. Use HTTPS in production.');
      return null;
    }

    const cert = fs.readFileSync(certPath, 'utf8');
    const key = fs.readFileSync(keyPath, 'utf8');

    logger.info('✓ SSL certificates loaded successfully');

    return { cert, key };
  } catch (error) {
    logger.error(`Failed to load SSL certificates: ${error.message}`);
    logger.warn('Falling back to HTTP mode');
    return null;
  }
};

/**
 * Create HTTPS server
 */
const createHTTPSServer = (app) => {
  const sslCerts = loadSSLCertificates();

  if (!sslCerts) {
    logger.warn('SSL disabled. For production, enable HTTPS.');
    return null;
  }

  const options = {
    cert: sslCerts.cert,
    key: sslCerts.key,
    // Security options
    minVersion: 'TLSv1.2',
    ciphers: 'HIGH:!aNULL:!MD5',
    requestCert: false,
  };

  const httpsServer = https.createServer(options, app);
  logger.info('✓ HTTPS server configured');

  return httpsServer;
};

/**
 * Generate self-signed certificate (for development only)
 */
const generateSelfSignedCert = () => {
  const spawn = require('child_process').spawn;
  const sslDir = './ssl';

  // Create ssl directory if it doesn't exist
  if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir, { recursive: true });
  }

  const certPath = path.join(sslDir, 'cert.pem');
  const keyPath = path.join(sslDir, 'key.pem');

  // Check if certificates already exist
  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    logger.info('✓ Self-signed certificates already exist');
    return;
  }

  logger.info('Generating self-signed certificate (development only)...');

  try {
    const openssl = spawn('openssl', [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-keyout',
      keyPath,
      '-out',
      certPath,
      '-days',
      '365',
      '-nodes',
      '-subj',
      '/CN=localhost',
    ]);

    openssl.on('close', (code) => {
      if (code === 0) {
        logger.info('✓ Self-signed certificate generated at ./ssl/');
      } else {
        logger.error('Failed to generate self-signed certificate');
      }
    });

    openssl.on('error', (error) => {
      logger.error(`OpenSSL error: ${error.message}`);
      logger.warn('Install OpenSSL to auto-generate certificates');
    });
  } catch (error) {
    logger.error(`Certificate generation error: ${error.message}`);
  }
};

/**
 * SSL redirect middleware (HTTP to HTTPS)
 */
const sslRedirect = (req, res, next) => {
  if (process.env.SSL_ENABLED === 'true' && req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
};

/**
 * HSTS middleware (HTTP Strict Transport Security)
 */
const hstsMiddleware = (req, res, next) => {
  if (process.env.SSL_ENABLED === 'true') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
};

module.exports = {
  loadSSLCertificates,
  createHTTPSServer,
  generateSelfSignedCert,
  sslRedirect,
  hstsMiddleware,
};
