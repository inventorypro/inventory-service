const express = require('express');
const router = express.Router();
const StockLevel = require('../models/stockLevel');

// GET /inventory/stock-levels - Retrieves current stock levels for all inventory items
router.get('/', async (req, res) => {
  try {
    const stockLevels = await StockLevel.find();
    res.json(stockLevels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /inventory/stock-levels/:itemId - Retrieves the stock level of a specific inventory item by its ID
router.get('/:itemId', async (req, res) => {
  try {
    const stockLevel = await StockLevel.findOne({ itemId: req.params.itemId });
    if (!stockLevel) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(stockLevel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /inventory/stock-levels - Updates stock levels for multiple inventory items
router.post('/', async (req, res) => {
  try {
    const updates = req.body;
    const updatePromises = updates.map(update => {
      return StockLevel.findOneAndUpdate(
        { itemId: update.itemId },
        { stockLevel: update.stockLevel },
        { new: true, upsert: true }
      );
    });
    const updatedItems = await Promise.all(updatePromises);
    res.json(updatedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
