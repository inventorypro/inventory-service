const mongoose = require('mongoose');

const stockLevelSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true,
    unique: true,
  },
  stockLevel: { type: Number, required: true },
});

module.exports =
  mongoose.models.StockLevel || mongoose.model('StockLevel', stockLevelSchema);
