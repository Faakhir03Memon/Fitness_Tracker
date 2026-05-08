const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// @route   GET /api/foods
// @desc    Get all global food items
router.get('/', async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
