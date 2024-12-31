const express = require('express');
const router = express.Router();
const logger = require('../logger');
const StockLevel = require('../models/stockLevel');

// GET /inventory/stock-levels - Retrieves current stock levels for all inventory items
router.get('/', async (req, res) => {
  logger.info('Request to get all stock levels started');
  try {
    const stockLevels = await StockLevel.find().populate('itemId');
    res.json(stockLevels);
    logger.info('Request to get all stock levels completed');
  } catch (error) {
    logger.error({ error }, 'Query to get all stock levels errored');
    res.status(500).json({ message: error.message });
  }
});

// GET /inventory/stock-levels/:itemId - Retrieves the stock level of a specific inventory item by its ID
router.get('/:itemId', async (req, res) => {
  logger.info(
    { itemId: req.params.itemId },
    'Request to get stock level by item ID started'
  );
  try {
    const stockLevel = await StockLevel.findOne({
      itemId: req.params.itemId,
    }).populate('itemId');
    if (!stockLevel) {
      logger.warn({ itemId: req.params.itemId }, 'Item not found');
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(stockLevel);
    logger.info(
      { itemId: req.params.itemId },
      'Request to get stock level by item ID completed'
    );
  } catch (error) {
    logger.error(
      { error, itemId: req.params.itemId },
      'Query to get stock level by item ID errored'
    );
    res.status(500).json({ message: error.message });
  }
});

// POST /inventory/stock-levels - Updates stock levels for multiple inventory items
router.post('/', async (req, res) => {
  logger.info({ payload: req.body }, 'Request to update stock levels started');
  try {
    const updates = req.body;
    const updatePromises = updates.map((update) => {
      return StockLevel.findOneAndUpdate(
        { itemId: update.itemId },
        { stockLevel: update.stockLevel },
        { new: true, upsert: true }
      ).populate('itemId');
    });
    const updatedItems = await Promise.all(updatePromises);
    res.json(updatedItems);
    logger.info('Stock levels updated successfully');
  } catch (error) {
    logger.error(
      { error, payload: req.body },
      'Request to update stock levels errored'
    );
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
