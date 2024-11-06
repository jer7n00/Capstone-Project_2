"use strict";
// src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
// MongoDB connection
const dbConfig = {
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/team_microservice',
};
// Connect to MongoDB
mongoose_1.default.connect(dbConfig.url, {})
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
// Define routes here
// app.use('/api/teams', teamRoutes);
// app.use('/api/players', playerRoutes);
