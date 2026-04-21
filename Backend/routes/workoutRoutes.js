const express = require('express');
const router = express.Router();
const Workout = require('../../Core/models/Workout');

// Get all workouts
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new workout
router.post('/', async (req, res) => {
  const workout = new Workout({
    type: req.body.type,
    duration: req.body.duration,
    calories: req.body.calories,
    notes: req.body.notes
  });

  try {
    const newWorkout = await workout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get stats (summary)
router.get('/stats', async (req, res) => {
  try {
    const totalWorkouts = await Workout.countDocuments();
    const stats = await Workout.aggregate([
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
