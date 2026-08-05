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

// Connect to MongoDB then start server
connectDB().then(() => {
  const { createIndexes } = require('./config/indexes');
  createIndexes().catch((err) => console.error('Failed to create database indexes:', err));

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} [Reports System Clean & Real-Time Ready]`);
  });
}).catch((err) => {
  console.error('Database connection error:', err.message);
  process.exit(1);
});
