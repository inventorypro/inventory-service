const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  supplierId: { type: String, required: true },
  reorderLevel: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
  status: { type: String, default: 'active' }
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);