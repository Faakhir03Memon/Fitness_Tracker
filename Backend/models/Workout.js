const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Workout', workoutSchema);
