const { createProxyMiddleware } = require('http-proxy-middleware');
const containerManager = require('../../services/workspace-service/src/services/containerManager');

/**
 * Reverse proxy middleware for routing /workspace-proxy/:workspaceId/* to the student container
 */
function cloudWorkspaceProxyHandler(req, res, next) {
  const match = req.url.match(/^\/workspace-proxy\/([^\/]+)/);
  if (!match) {
    return next();
  }

  const workspaceId = match[1];
  const wsStatus = containerManager.getWorkspaceStatus(workspaceId);

  if (!wsStatus || wsStatus.status !== 'running' || !wsStatus.port) {
    return res.status(503).json({
      success: false,
      message: 'Workspace container is starting or currently offline. Please try again in a few seconds.',
      workspaceId
    });
  }

  // Update activity timestamp for 30-min idle shutdown tracker
  containerManager.updateWorkspaceActivity(workspaceId);

  const target = `http://127.0.0.1:${wsStatus.port}`;

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying for VS Code terminal & extension host
    pathRewrite: (pathStr) => {
      // Strip /workspace-proxy/:workspaceId prefix
      return pathStr.replace(new RegExp(`^/workspace-proxy/${workspaceId}`), '') || '/';
    },
    onError: (err, req, res) => {
      console.error(`[WorkspaceProxyError] Proxy failed for workspace ${workspaceId}:`, err.message);
      if (!res.headersSent) {
        res.status(502).send('Workspace Proxy Error: Unable to connect to container IDE.');
      }
    }
  });

  return proxy(req, res, next);
}

module.exports = cloudWorkspaceProxyHandler;
