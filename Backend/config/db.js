const mongoose = require('mongoose');

async function connectDB(uri) {
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

module.exports = { connectDB };
