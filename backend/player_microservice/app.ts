import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();


import playerRoutes from './routes/player.route';
import './config/db.config';  // Connect to MongoDB

const app = express();
app.use(cors()); // Enable CORS

app.use(express.json());

app.use('/', playerRoutes);

export default app;