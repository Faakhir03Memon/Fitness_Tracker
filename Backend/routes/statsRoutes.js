const express = require('express');
const router = express.Router();
const DailyStats = require('../models/DailyStats');
const { protect } = require('../middleware/authMiddleware');

// Get stats for a specific day for the logged in user
router.get('/:date', protect, async (req, res) => {
  try {
    // We use findOneAndUpdate with upsert to avoid race conditions and handle index issues
    let stats = await DailyStats.findOneAndUpdate(
      { user: req.user._id, date: req.params.date },
      { $setOnInsert: { user: req.user._id, date: req.params.date, steps: 0, water: 0, caloriesBurned: 0, activeMinutes: 0 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(stats);
  } catch (err) {
    console.error("Stats Fetch Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update stats (Steps, Water, etc.) for the logged in user
router.post('/update', protect, async (req, res) => {
  const { date, steps, water, weight } = req.body;
  try {
    const update = {};
    if (steps !== undefined) update.steps = Number(steps);
    if (water !== undefined) update.water = Number(water);
    if (weight !== undefined) update.weight = Number(weight);
    
    let stats = await DailyStats.findOneAndUpdate(
      { user: req.user._id, date },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    res.json(stats);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get stats for the last 7 days for the logged in user
router.get('/range/weekly', protect, async (req, res) => {
  try {
    const stats = await DailyStats.find({ user: req.user._id }).sort({ date: -1 }).limit(7);
    res.json(stats.reverse());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
