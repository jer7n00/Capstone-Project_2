import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongodbUri: process.env.MONGODB_URI,
 // jwtSecret: process.env.JWT_SECRET|| 'defaultSecret',
  //jwtExpiration: process.env.JWT_EXPIRATION,
};
