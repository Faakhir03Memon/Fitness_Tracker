const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Workout = require('../models/Workout');
const DailyStats = require('../models/DailyStats');
const Meal = require('../models/Meal');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all users
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user status (Ban/Unban)
router.put('/users/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { isBanned, status } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { isBanned, status }, 
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete user (Kick)
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        // Also cleanup their data
        await Workout.deleteMany({ user: req.params.id });
        await DailyStats.deleteMany({ user: req.params.id });
        await Meal.deleteMany({ user: req.params.id });
        res.json({ message: 'User and all related data removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user detailed logs
router.get('/users/:id/logs', protect, adminOnly, async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.params.id }).limit(10);
        const meals = await Meal.find({ user: req.params.id }).limit(10);
        const stats = await DailyStats.find({ user: req.params.id }).sort({ date: -1 }).limit(7);
        res.json({ workouts, meals, stats });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
