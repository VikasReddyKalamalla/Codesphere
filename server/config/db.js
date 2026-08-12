const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUris = [
    'mongodb://root:rootpassword@localhost:27017/codesphere?authSource=admin',
    'mongodb://127.0.0.1:27017/codesphere',
    process.env.MONGO_URI_ATLAS
  ].filter(Boolean);

  const urisToTry = Array.from(new Set([primaryUri, ...fallbackUris])).filter(Boolean);

  for (const uri of urisToTry) {
    try {
      const isAtlas = uri.includes('mongodb+srv');
      console.log(`Connecting to MongoDB (${isAtlas ? 'Atlas Remote' : 'Local'})...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✓ MongoDB Connected: ${conn.connection.host} | DB Name: ${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.warn(`MongoDB connection attempt failed (${uri.includes('mongodb+srv') ? 'Atlas Remote' : uri}): ${error.message}`);
    }
  }

  console.warn('⚠️ MongoDB connection failed on all targets. Server running with limited/mock fallbacks.');
  mongoose.set('bufferCommands', false);
};

module.exports = connectDB;

