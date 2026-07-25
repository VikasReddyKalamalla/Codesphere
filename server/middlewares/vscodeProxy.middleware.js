/**
 * VS Code Web Proxy Middleware
 * ─────────────────────────────────────────────────────────────────────────────
 * Mounts at /vscode-web in app.js (app.use('/vscode-web', router)).
 *
 * URL scheme:
 *   /vscode-web/<port>/<rest...>  →  http://127.0.0.1:<port>/<rest...>
 *
 * The Vite dev-server also proxies /vscode-web → Express (already in vite.config.js).
 * So the browser always requests /vscode-web/<port>/... regardless of environment.
 *
 * VS Code Web internally generates absolute URLs like
 *   http://127.0.0.1:<port>/static/build/...
 * The proxy rewrites those response headers so the browser follows the proxied path.
 *
 * WebSocket upgrade (VS Code terminal / live-share) is handled via attachWsProxy().
 */

'use strict';

const express          = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const MIN_PORT = 9888;
const MAX_PORT = 9999;

const isValidPort = (p) => {
  const n = parseInt(p, 10);
  return !isNaN(n) && n >= MIN_PORT && n <= MAX_PORT;
};

const router = express.Router();

/**
 * Dynamic proxy: for every request to /:port/*, proxy to http://127.0.0.1:<port>/*
 *
 * http-proxy-middleware is used here instead of http-proxy because it correctly
 * handles path rewriting and response header rewriting (Location redirects).
 */
router.use('/:port', (req, res, next) => {
  const port = req.params.port;

  if (!isValidPort(port)) {
    return res.status(400).json({ error: `Invalid VS Code server port: ${port}` });
  }

  // Strip /vscode-web/<port> prefix — req.url at this point starts with /
  // because Express has already consumed the /:port segment. So req.url is
  // already the correct downstream path (e.g. "/" or "/static/build/...").
  const target = `http://127.0.0.1:${port}`;

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,
    // Rewrite absolute Location headers in redirects so they go through our proxy
    autoRewrite: true,
    // Don't compress — let VS Code serve pre-gzipped assets as-is
    compress: false,
    // Remove X-Frame-Options so the iframe can embed VS Code
    on: {
      proxyRes: (proxyRes) => {
        delete proxyRes.headers['x-frame-options'];
        delete proxyRes.headers['content-security-policy'];
        // Allow embedding from any same-origin parent
        proxyRes.headers['x-frame-options'] = 'SAMEORIGIN';
      },
      error: (err, req, res) => {
        if (res && !res.headersSent) {
          res.status(502).json({
            error: 'VS Code server not reachable',
            detail: err.message,
          });
        }
      },
    },
  });

  return proxy(req, res, next);
});

/**
 * Attach WebSocket upgrade handler to an http.Server instance.
 *
 * Call once in server.js after server creation:
 *   const { attachWsProxy } = require('./middlewares/vscodeProxy.middleware');
 *   attachWsProxy(httpServer);
 */
const attachWsProxy = (server) => {
  server.on('upgrade', (req, socket, head) => {
    const match = req.url.match(/^\/vscode-web\/(\d+)(\/.*)?$/);
    if (!match) return;

    const port = match[1];
    if (!isValidPort(port)) {
      socket.destroy();
      return;
    }

    // Rewrite URL to downstream path before proxying
    req.url = match[2] || '/';

    const proxy = createProxyMiddleware({
      target: `http://127.0.0.1:${port}`,
      ws: true,
      changeOrigin: true,
    });

    // Trigger WS proxy upgrade
    if (proxy.upgrade) {
      proxy.upgrade(req, socket, head);
    }
  });
};

module.exports = router;
module.exports.attachWsProxy = attachWsProxy;
