const mongoose = require('mongoose');

// In serverless environments we want to reuse an existing mongoose connection
// if one exists to avoid opening too many connections.
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      // Already connected
      return mongoose.connection;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    return mongoose.connection;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit process in serverless; rethrow so the platform can surface the error
    throw error;
  }
};

module.exports = connectDB;
