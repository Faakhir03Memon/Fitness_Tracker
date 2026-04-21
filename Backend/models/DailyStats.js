const mongoose = require('mongoose');

const dailyStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  date: {
    type: String, // Format: YYYY-MM-DD for easy lookup
    required: true,
  },
  steps: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  activeMinutes: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFats: { type: Number, default: 0 },
  totalCaloriesIn: { type: Number, default: 0 },
  weight: { type: Number },
});

// Compound index to ensure uniqueness of stats per user per day
dailyStatsSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyStats', dailyStatsSchema);
