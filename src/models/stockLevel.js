const mongoose = require('mongoose');

const stockLevelSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  stockLevel: { type: Number, required: true }
});

const StockLevel = mongoose.model('StockLevel', stockLevelSchema);

module.exports = StockLevel;
