const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const DailyStats = require('../models/DailyStats');
const { protect } = require('../middleware/authMiddleware');

// Get all meals for today
router.get('/:date', protect, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user._id, date: req.params.date });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new meal and update daily stats
router.post('/', protect, async (req, res) => {
  const { mealType, foodName, calories, protein, carbs, fats, date } = req.body;
  
  const meal = new Meal({
    user: req.user._id,
    date,
    mealType,
    foodName,
    calories: Number(calories),
    protein: Number(protein),
    carbs: Number(carbs),
    fats: Number(fats)
  });

  try {
    const newMeal = await meal.save();
    
    // Update daily stats for the user
    let stats = await DailyStats.findOneAndUpdate(
        { user: req.user._id, date },
        { 
            $inc: { 
                totalProtein: Number(protein),
                totalCarbs: Number(carbs),
                totalFats: Number(fats),
                totalCaloriesIn: Number(calories)
            } 
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(newMeal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
