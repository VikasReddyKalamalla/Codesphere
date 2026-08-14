let createProxyMiddleware;
try {
  const hpm = require('http-proxy-middleware');
  createProxyMiddleware = hpm.createProxyMiddleware || hpm;
} catch (e) {
  createProxyMiddleware = null;
}
const containerManager = require('../../services/workspace-service/src/services/containerManager');

/**
 * Reverse proxy middleware for routing /workspace-proxy/:workspaceId/* to the student container
 */
async function cloudWorkspaceProxyHandler(req, res, next) {
  const urlPath = req.originalUrl || req.url;
  const match = urlPath.match(/^\/workspace-proxy\/([^\/]+)/);
  if (!match) {
    return next();
  }

  const workspaceId = match[1];
  let wsStatus = containerManager.getWorkspaceStatus(workspaceId);

  // Auto-provision container if not already running
  if (!wsStatus || wsStatus.status !== 'running' || !wsStatus.port) {
    try {
      wsStatus = await containerManager.createOrStartWorkspaceContainer('650000000000000000000001', workspaceId, 'javascript', 'free');
    } catch (e) {
      console.warn('[WorkspaceProxy] Auto-provision warning:', e.message);
    }
  }

  if (!wsStatus || wsStatus.status !== 'running' || !wsStatus.port) {
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>VS Code Web Studio</title>
        <style>
          body { margin:0; padding:0; background:#0d1117; color:#c9d1d9; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center; }
          .spinner { width:36px; height:36px; border:3px solid #21262d; border-top-color:#04AA6D; border-radius:50%; animation:spin 1s linear infinite; margin-bottom:16px; }
          @keyframes spin { to { transform:rotate(360deg); } }
          h2 { font-size:15px; font-weight:600; color:#f0f6fc; margin:0 0 8px; }
          p { font-size:12px; color:#8b949e; margin:0 0 16px; max-width:300px; line-height:1.5; }
          button { background:#04AA6D; color:#fff; border:none; padding:8px 16px; border-radius:8px; font-weight:600; cursor:pointer; font-size:11px; }
          button:hover { background:#03935e; }
        </style>
      </head>
      <body>
        <div class="spinner"></div>
        <h2>Initializing VS Code Environment</h2>
        <p>Setting up project workspace #${workspaceId}. This takes a few seconds...</p>
        <button onclick="window.location.reload()">Reload IDE</button>
      </body>
      </html>
    `);
  }

  // Update activity timestamp
  containerManager.updateWorkspaceActivity(workspaceId);

  const target = `http://127.0.0.1:${wsStatus.port}`;

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,
    pathRewrite: (pathStr, reqObj) => {
      const orig = reqObj.originalUrl || pathStr;
      return orig.replace(new RegExp(`^/workspace-proxy/${workspaceId}`), '') || '/';
    },
    onError: (err, req, res) => {
      console.error(`[WorkspaceProxyError] Proxy failed for workspace ${workspaceId}:`, err.message);
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"/><title>VS Code Web Studio</title></head>
          <body style="background:#0d1117;color:#fff;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;">
            <h3 style="color:#04AA6D;">⚡ Codesphere Live Editor Active</h3>
            <p style="color:#8b949e;font-size:12px;">Editing workspace #${workspaceId}</p>
            <script>setTimeout(() => window.location.reload(), 3000);</script>
          </body>
          </html>
        `);
      }
    }
  });

  return proxy(req, res, next);
}

module.exports = cloudWorkspaceProxyHandler;
