const express = require('express');
const router = express.Router();
const logger = require('../logger');
const StockLevel = require('../models/stockLevel');

/**
 * @swagger
 * /inventory/stock-levels:
 *   get:
 *     summary: Retrieve current stock levels for all inventory items
 *     tags: [StockLevels]
 *     responses:
 *       200:
 *         description: A list of stock levels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockLevel'
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /inventory/stock-levels/{itemId}:
 *   get:
 *     summary: Retrieve the stock level of a specific inventory item by its ID
 *     tags: [StockLevels]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The inventory item ID
 *     responses:
 *       200:
 *         description: A single stock level
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockLevel'
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /inventory/stock-levels:
 *   post:
 *     summary: Update stock levels for multiple inventory items
 *     tags: [StockLevels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/StockLevel'
 *     responses:
 *       200:
 *         description: Stock levels updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockLevel'
 *       500:
 *         description: Server error
 */
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
