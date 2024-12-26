const mongoose = require('mongoose');

const stockLevelSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true, unique: true },
  stockLevel: { type: Number, required: true }
});

const StockLevel = mongoose.model('StockLevel', stockLevelSchema);

module.exports = StockLevel;
