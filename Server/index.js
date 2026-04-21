const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../Core/db');
const workoutRoutes = require('../Backend/routes/workoutRoutes');
const statsRoutes = require('../Backend/routes/statsRoutes');

dotenv.config();

// Initialize the database connection from Core
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
  res.send('FitTrack Main Server is Running...');
});

const PORT = process.env.PORT || 5001; // Running on a different port than the backend folder for flexibility

app.listen(PORT, () => {
  console.log(`Server: Running on port ${PORT}`);
});
