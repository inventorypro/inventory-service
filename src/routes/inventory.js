const express = require('express');
const router = express.Router();
const logger = require('../logger');
const InventoryItem = require('../models/inventoryItem');
const Category = require('../models/category');
const Supplier = require('../models/supplier');

// Middleware to get inventory item by ID
async function getItem(req, res, next) {
  let item;
  try {
    logger.info({ itemId: req.params.id }, 'Query to find inventory item by ID started');

    item = await InventoryItem.findById(req.params.id)
      .populate('categoryId')
      .populate('supplierId');
    if (item == null) {
      logger.warn({ itemId: req.params.id }, 'Cannot find the inventory item');
      return res.status(404).json({ message: 'Cannot find inventory item' });
    }
  } catch (err) {
    logger.error({ err, itemId: req.params.id }, 'Query to find inventory item by ID errored');
    return res.status(500).json({ message: err.message });
  }

  res.item = item;
  next();
}

// Get all inventory items
router.get('/', async (req, res) => {
  logger.info('Request to get all inventory items started');
  try {
    const items = await InventoryItem.find().populate('categoryId').populate('supplierId');
    res.json(items);
    logger.info('Request to get all inventory items completed');
  } catch (err) {
    logger.error({ err }, 'Query to get all inventory items errored');
    res.status(500).json({ message: err.message });
  }
});

// Get an inventory item by ID
router.get('/:id', getItem, (req, res) => {
  logger.info({ itemId: req.params.id }, 'Request to get inventory item by ID started');
  res.json(res.item);
  logger.info({ itemId: req.params.id }, 'Request to get inventory item by ID completed');
});

// Create a new inventory item
router.post('/', async (req, res) => {
  logger.info({ payload: req.body }, 'Request to create new inventory item started');
  const item = new InventoryItem({
    itemId: req.body.itemId,
    name: req.body.name,
    description: req.body.description,
    categoryId: req.body.categoryId,
    quantity: req.body.quantity,
    price: req.body.price,
    supplierId: req.body.supplierId,
    reorderLevel: req.body.reorderLevel,
    status: req.body.status
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
    logger.info({ newItem }, 'Inventory item created successfully');
  } catch (err) {
    logger.error({ err, payload: req.body }, 'Request to create new inventory item errored');
    res.status(400).json({ message: err.message });
  }
});

// Update an inventory item
router.put('/:id', getItem, async (req, res) => {
  logger.info({ itemId: req.params.id, payload: req.body }, 'Request to update inventory item started');

  if (req.body.name != null) {
    res.item.name = req.body.name;
  }
  if (req.body.description != null) {
    res.item.description = req.body.description;
  }
  if (req.body.categoryId != null) {
    res.item.categoryId = req.body.categoryId;
  }
  if (req.body.quantity != null) {
    res.item.quantity = req.body.quantity;
  }
  if (req.body.price != null) {
    res.item.price = req.body.price;
  }
  if (req.body.supplierId != null) {
    res.item.supplierId = req.body.supplierId;
  }
  if (req.body.reorderLevel != null) {
    res.item.reorderLevel = req.body.reorderLevel;
  }
  if (req.body.status != null) {
    res.item.status = req.body.status;
  }

  try {
    const updatedItem = await res.item.save();
    res.json(updatedItem);
    logger.info({ itemId: req.params.id, updatedItem }, 'Inventory item updated successfully');
  } catch (err) {
    logger.error({ err, itemId: req.params.id }, 'Request to update inventory item errored');
    res.status(400).json({ message: err.message });
  }
});

// Delete an inventory item
router.delete('/:id', getItem, async (req, res) => {
  logger.info({ itemId: req.params.id }, 'Request to delete inventory item started');
  try {
    await res.item.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted Inventory Item' });
    logger.info({ itemId: req.params.id }, 'Inventory item deleted successfully');
  } catch (err) {
    logger.error({ err, itemId: req.params.id }, 'Request to delete inventory item errored');
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
