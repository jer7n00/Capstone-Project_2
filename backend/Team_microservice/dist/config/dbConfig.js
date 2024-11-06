"use strict";
// // config/dbConfig.ts
// import mongoose from 'mongoose';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// export const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/team_microservice', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };
const mongoose_1 = __importDefault(require("mongoose"));
const dbConfig = {
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/team_microservice',
};
mongoose_1.default.connect(dbConfig.url)
    .then(() => {
    console.log('Connected to the database');
})
    .catch((error) => {
    console.error('Database connection error:', error);
});
