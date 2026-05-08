const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cal: { type: Number, required: true },
  pro: { type: Number, required: true },
  carb: { type: Number, required: true },
  fat: { type: Number, required: true },
  category: { type: String, required: true }
});

module.exports = mongoose.model('Food', foodSchema);
