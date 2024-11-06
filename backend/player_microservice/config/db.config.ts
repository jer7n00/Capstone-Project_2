import mongoose from 'mongoose';

const dbURI = 'mongodb://0.0.0.0:27017/playerdb';

mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));