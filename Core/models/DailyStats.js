const mongoose = require('mongoose');

const dailyStatsSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  steps: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  activeMinutes: { type: Number, default: 0 }
});

module.exports = mongoose.model('DailyStats', dailyStatsSchema);
