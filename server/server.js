require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./socket/socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Connect to MongoDB then start server
connectDB().then(() => {
  // Create database indexes on startup (if MongoDB is connected)
  if (process.env.NODE_ENV !== 'development' || process.env.MONGO_URI) {
    const { createIndexes } = require('./config/indexes');
    createIndexes().catch((err) => console.error('Failed to create database indexes:', err));
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Database connection error, but starting server anyway:', err.message);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (without database)`);
  });
});
