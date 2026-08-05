const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // bufferCommands: false makes Mongoose throw immediately on operations
    // when not connected, instead of buffering for 10s → avoids 500 timeouts.
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host} | DB Name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`MongoDB connection notice: ${error.message}`);
    console.warn('⚠️ Server will operate using in-memory / mock database fallbacks.');
  }
};

module.exports = connectDB;
