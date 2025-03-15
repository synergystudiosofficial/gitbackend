const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connection successful!');
    console.log('Connection details:', {
      host: mongoose.connection.host,
      database: mongoose.connection.name,
      state: mongoose.connection.readyState
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();