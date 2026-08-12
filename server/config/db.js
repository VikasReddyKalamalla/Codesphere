const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host} | DB Name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`MongoDB connection notice: ${error.message}`);
    console.warn('⚠️ Server will operate using in-memory / mock database fallbacks.');
    mongoose.set('bufferCommands', false);
  }
};

module.exports = connectDB;

