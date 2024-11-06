import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { config } from './config/config';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Check if mongodbUri is defined
if (!config.mongodbUri) {
  throw new Error('MONGODB_URI is not defined in the environment variables.');
}

// Connect to MongoDB
mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  app.use(cors());

  app.use(express.json());

// Routes
app.use('/', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;
