// CodeSphere Realtime Server v1.0.6 - Event source enum fix & schema auto-reload
require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./socket/socket');
const { attachWsProxy } = require('./middlewares/vscodeProxy.middleware');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Attach VS Code Web WebSocket proxy (terminal, file-watch, hot-reload)
attachWsProxy(server);

// Start HTTP server immediately — don't wait for MongoDB
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} [Reports System Clean & Real-Time Ready]`);
});

// Connect to MongoDB asynchronously — server stays up either way
connectDB().then(() => {
  const { createIndexes } = require('./config/indexes');
  createIndexes().catch((err) => console.error('Failed to create database indexes:', err));
}).catch((err) => {
  console.warn('MongoDB unavailable — server running with limited functionality:', err.message);
});

