// config/dbConfig.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dbConfig = {
  url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/team_microservice',
};

export const connectDB = async () => {
  try {
    await mongoose.connect(dbConfig.url, {
    //  useNewUrlParser: true,
   //   useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit if unable to connect to the database
  }
};
