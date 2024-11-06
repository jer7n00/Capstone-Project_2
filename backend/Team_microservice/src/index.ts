// src/index.ts

import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import teamRoutes from './routes/teamRoutes';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// Middleware
app.use(express.json());


// MongoDB connection
const dbConfig = {
  url: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/team_microservice',
};


// Connect to MongoDB
mongoose.connect(dbConfig.url, {} as ConnectOptions)
  .then(() => {
    console.log('Connected to the database');
    
    // Start the server after successful database connection
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

//Define routes here
 app.use('/api', teamRoutes);
  //api/update/:teamId/series 
//app.use('/api/players', playerRoutes);
