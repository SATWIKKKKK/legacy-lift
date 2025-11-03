const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/legacy_lift';

/**
 * Simple MongoDB connection helper.
 * Usage:
 *   const { connectDB } = require('./models/connection');
 *   await connectDB();
 */
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected:', mongoose.connection.host);
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = { connectDB, mongoose };
