const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const workspaceRoutes = require('./routes/workspace.routes');
const { startIdleShutdownMonitor } = require('./services/idleShutdownManager');

dotenv.config();

const app = express();
const PORT = process.env.WORKSPACE_SERVICE_PORT || 5050;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Workspace Manager Service' });
});

// Workspace API routes
app.use('/workspace', workspaceRoutes);
app.use('/api/workspace', workspaceRoutes);

// Start 30-min idle container monitor
startIdleShutdownMonitor();

app.listen(PORT, () => {
  console.log(`🚀 CodeSphere Workspace Manager Service running on port ${PORT}`);
});
