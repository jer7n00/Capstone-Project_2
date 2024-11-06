import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import tournamentRoutes from './routes/tournamentRoutes';
import registrationRoutes from './routes/registrationRoutes';
import matchRoutes from './routes/matchRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
// Middleware
app.use(bodyParser.json());


// Database Connection   
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/organizer', {
//  useUnifiedTopology: true, // Uncomment this line to enable unified topology
 // useNewUrlParser: true,    // Optional: Use new URL parser
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/matches', matchRoutes);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
