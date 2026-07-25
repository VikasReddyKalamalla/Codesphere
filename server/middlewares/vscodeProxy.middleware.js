/**
 * VS Code Web Proxy Middleware
 * ─────────────────────────────────────────────────────────────────────────────
 * Routes:
 *   GET/POST/WS  /vscode-web/:port/*  →  http://127.0.0.1:<port>/*
 *
 * Why this exists:
 *   The @vscode/test-web server spawns on 127.0.0.1:<port>.  Embedding it
 *   directly in an <iframe> breaks because the browser considers it a
 *   cross-origin frame (different port = different origin).
 *   By proxying every request through the Express API server we keep
 *   everything on the same origin and avoid CORS / X-Frame-Options issues.
 *
 * Security:
 *   - Only ports in the allowed range [9888, 9999] are proxied.
 *   - The middleware validates the port before forwarding.
 *   - WebSocket upgrade (for VS Code's built-in terminal / file-watch) is
 *     also forwarded via node's http.request upgrade mechanism.
 */

const http     = require('http');
const net      = require('net');
const url      = require('url');
const express  = require('express');
const httpProxy = require('http-proxy');

const MIN_PORT = 9888;
const MAX_PORT = 9999;

// One shared proxy server instance (reused for every request)
const proxy = httpProxy.createProxyServer({
  ws:              true,
  changeOrigin:    true,
  xfwd:            true,
  proxyTimeout:    30000,
  timeout:         30000,
});

// Silence default "ECONNREFUSED" noise when the VS Code server hasn't started yet
proxy.on('error', (err, _req, res) => {
  const msg = 'VS Code server not reachable. It may still be starting — please retry in a moment.';
  if (res && !res.headersSent) {
    if (typeof res.writeHead === 'function') {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
    }
    res.end(msg);
  }
});

/**
 * Build the target URL from the :port param.
 * Returns null when the port is outside the allowed range.
 */
const resolveTarget = (portStr) => {
  const port = parseInt(portStr, 10);
  if (isNaN(port) || port < MIN_PORT || port > MAX_PORT) return null;
  return `http://127.0.0.1:${port}`;
};

/**
 * Express router that handles HTTP + WebSocket proxying.
 *
 * Usage in app.js:
 *   const vscodeProxyRouter = require('./middlewares/vscodeProxy.middleware');
 *   app.use('/vscode-web', vscodeProxyRouter);
 */
const router = express.Router();

// ─── HTTP requests ────────────────────────────────────────────────────────────
router.use('/:port', (req, res, next) => {
  const target = resolveTarget(req.params.port);
  if (!target) {
    return res.status(400).json({ error: 'Invalid or out-of-range VS Code server port.' });
  }

  // Strip the /vscode-web/:port prefix so the VS Code server sees the right path
  req.url = req.url.replace(new RegExp(`^\\/${req.params.port}`), '') || '/';

  // Allow embedding in <iframe> from same origin
  res.removeHeader('X-Frame-Options');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  proxy.web(req, res, { target }, (err) => {
    if (!res.headersSent) {
      if (err && (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET')) {
        res.status(502).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta http-equiv="refresh" content="2">
            <title>Starting VS Code Studio</title>
            <style>
              body { background: #0d1117; color: #c9d1d9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .spinner { border: 3px solid #21262d; border-top: 3px solid #04AA6D; border-radius: 50%; width: 28px; height: 28px; animation: spin 1s linear infinite; margin-bottom: 16px; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              .msg { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #8b949e; }
              .sub { font-size: 11px; color: #484f58; margin-top: 6px; }
            </style>
          </head>
          <body>
            <div class="spinner"></div>
            <div class="msg">VS Code Web Server Starting…</div>
            <div class="sub">Connecting to workspace. Retrying automatically in 2 seconds</div>
          </body>
          </html>
        `);
      } else {
        next(err);
      }
    }
  });
});

/**
 * Attach WebSocket upgrade handler to an http.Server instance.
 * Call this once after server.listen() in server.js:
 *
 *   const { attachWsProxy } = require('./middlewares/vscodeProxy.middleware');
 *   attachWsProxy(httpServer);
 */
const attachWsProxy = (server) => {
  server.on('upgrade', (req, socket, head) => {
    // Only proxy WS connections that match our prefix
    const match = req.url.match(/^\/vscode-web\/(\d+)(\/.*)?$/);
    if (!match) return;

    const target = resolveTarget(match[1]);
    if (!target) {
      socket.destroy();
      return;
    }

    // Rewrite URL for the downstream server
    req.url = match[2] || '/';
    proxy.ws(req, socket, head, { target });
  });
};

module.exports = router;
module.exports.attachWsProxy = attachWsProxy;
