const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const DailyStats = require('../models/DailyStats');
const { protect } = require('../middleware/authMiddleware');

// Get all workouts for the logged in user
router.get('/', protect, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new workout and update daily stats
router.post('/', protect, async (req, res) => {
  const { type, duration, calories, notes } = req.body;
  
  const workout = new Workout({
    user: req.user._id,
    type,
    duration: Number(duration),
    calories: Number(calories),
    notes
  });

  try {
    const newWorkout = await workout.save();
    
    // Update daily stats for the user
    const today = new Date().toISOString().split('T')[0];
    let stats = await DailyStats.findOne({ user: req.user._id, date: today });
    
    if (!stats) {
        stats = new DailyStats({ user: req.user._id, date: today });
    }
    
    stats.caloriesBurned += Number(calories);
    stats.activeMinutes += Number(duration);
    await stats.save();

    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get total stats
router.get('/stats', protect, async (req, res) => {
  try {
    const totalWorkouts = await Workout.countDocuments({ user: req.user._id });
    const stats = await Workout.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: "$calories" },
          totalDuration: { $sum: "$duration" }
        }
      }
    ]);

    res.json({
      totalWorkouts,
      totalCalories: stats[0]?.totalCalories || 0,
      totalDuration: stats[0]?.totalDuration || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
