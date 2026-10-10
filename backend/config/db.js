const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sportshub';
  
  const tryConnect = async () => {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 7000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.warn(`⚠️ Primary MongoDB Connection Error: ${error.message}`);
      if (uri !== 'mongodb://127.0.0.1:27017/sportshub') {
        try {
          console.log('🔄 Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/sportshub)...');
          const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/sportshub', {
            serverSelectionTimeoutMS: 3000,
          });
          console.log(`✅ Connected to local fallback MongoDB: ${fallbackConn.connection.host}`);
          return true;
        } catch (fallbackError) {
          console.error(`❌ Fallback MongoDB Connection Error: ${fallbackError.message}`);
        }
      }
      return false;
    }
  };

  const success = await tryConnect();
  if (!success) {
    console.log('⏳ Will retry connecting to MongoDB in 10 seconds...');
    const retryInterval = setInterval(async () => {
      const reconnected = await tryConnect();
      if (reconnected) {
        clearInterval(retryInterval);
      }
    }, 10000);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB connection lost. Reconnecting...');
  });
};

module.exports = connectDB;
