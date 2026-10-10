const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sportshub';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB Connection Error: ${error.message}`);
    if (uri !== 'mongodb://127.0.0.1:27017/sportshub') {
      try {
        console.log('🔄 Fallback to local MongoDB (mongodb://127.0.0.1:27017/sportshub)...');
        const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/sportshub', {
          serverSelectionTimeoutMS: 2000,
        });
        console.log(`✅ Connected to local fallback MongoDB: ${fallbackConn.connection.host}`);
      } catch (fallbackError) {
        console.error(`❌ Fallback MongoDB Connection Error: ${fallbackError.message}`);
      }
    }
  }
};

module.exports = connectDB;
