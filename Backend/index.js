const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const workoutRoutes = require('./routes/workoutRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
const adminRoutes = require('./routes/adminRoutes');
const Admin = require('./models/Admin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('FitTrack API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Fix legacy indexing issue that causes 500 errors
    try {
        const db = mongoose.connection.db;
        await db.collection('dailystats').dropIndex('date_1').catch(() => {});
        console.log('Database indexes synchronized');
    } catch (err) {}

    // Seed Admin User
    const adminEmail = 'fit@admin.com';
    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
        await Admin.create({
            name: 'Mymn SaaB',
            email: adminEmail,
            password: 'F1it@access.com'
        });
        console.log('Admin user Mymn SaaB seeded successfully');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
