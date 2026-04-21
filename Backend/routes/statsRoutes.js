const express = require('express');
const router = express.Router();
const DailyStats = require('../models/DailyStats');
const { protect } = require('../middleware/authMiddleware');

// Get stats for a specific day for the logged in user
router.get('/:date', protect, async (req, res) => {
  try {
    let stats = await DailyStats.findOne({ user: req.user._id, date: req.params.date });
    if (!stats) {
      stats = new DailyStats({ user: req.user._id, date: req.params.date });
      await stats.save();
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update stats (Steps, Water, etc.) for the logged in user
router.post('/update', protect, async (req, res) => {
  const { date, steps, water, weight } = req.body;
  try {
    let stats = await DailyStats.findOne({ user: req.user._id, date });
    if (!stats) {
      stats = new DailyStats({ user: req.user._id, date });
    }
    if (steps !== undefined) stats.steps = Number(steps);
    if (water !== undefined) stats.water = Number(water);
    if (weight !== undefined) stats.weight = Number(weight);
    
    await stats.save();
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
