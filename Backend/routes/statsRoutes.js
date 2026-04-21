const express = require('express');
const router = express.Router();
const DailyStats = require('../models/DailyStats');

// Get stats for a specific day
router.get('/:date', async (req, res) => {
  try {
    let stats = await DailyStats.findOne({ date: req.params.date });
    if (!stats) {
      stats = new DailyStats({ date: req.params.date });
      await stats.save();
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update stats (Steps, Water, etc.)
router.post('/update', async (req, res) => {
  const { date, steps, water, weight } = req.body;
  try {
    let stats = await DailyStats.findOne({ date });
    if (!stats) {
      stats = new DailyStats({ date });
    }
    if (steps !== undefined) stats.steps = steps;
    if (water !== undefined) stats.water = water;
    if (weight !== undefined) stats.weight = weight;
    
    await stats.save();
    res.json(stats);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get stats for the last 7 days (Weekly Chart)
router.get('/range/weekly', async (req, res) => {
  try {
    const stats = await DailyStats.find().sort({ date: -1 }).limit(7);
    res.json(stats.reverse());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
