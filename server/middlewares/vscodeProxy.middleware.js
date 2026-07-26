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
          res.setHeader('Content-Type', 'text/html');
          res.status(502).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8"/>
              <title>Reconnecting VS Code Studio</title>
              <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                  background-color: #0d1117;
                  color: #c9d1d9;
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  text-align: center;
                  padding: 20px;
                }
                .card {
                  background: #161b22;
                  border: 1px solid #30363d;
                  border-radius: 16px;
                  padding: 32px 24px;
                  max-width: 360px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 16px;
                }
                .icon-box {
                  width: 48px;
                  height: 48px;
                  border-radius: 12px;
                  background: rgba(248, 81, 73, 0.1);
                  border: 1px solid rgba(248, 81, 73, 0.2);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
                }
                h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #f85149; }
                p { font-size: 11px; color: #8b949e; line-height: 1.5; }
                button {
                  background: #04AA6D;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 10px;
                  font-weight: 700;
                  font-size: 11px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  cursor: pointer;
                  transition: background 0.2s;
                }
                button:hover { background: #03935e; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="icon-box">⚡</div>
                <h3>VS Code Server Disconnected</h3>
                <p>The workspace editor instance was interrupted. Click below to automatically restart your VS Code session.</p>
                <button onclick="if(window.parent){window.parent.postMessage('RECONNECT_VSCODE','*');} else {window.location.reload();}">Reconnect Workspace</button>
              </div>
            </body>
            </html>
          `);
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
