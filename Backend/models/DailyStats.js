const mongoose = require('mongoose');

const dailyStatsSchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD for easy lookup
    required: true,
    unique: true
  },
  steps: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  activeMinutes: { type: Number, default: 0 },
  weight: { type: Number },
});

module.exports = mongoose.model('DailyStats', dailyStatsSchema);
