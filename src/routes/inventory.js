const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/inventoryItem');

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get an inventory item by ID
router.get('/:id', getItem, (req, res) => {
  res.json(res.item);
});

// Create a new inventory item
router.post('/', async (req, res) => {
  const item = new InventoryItem({
    itemId: req.body.itemId,
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    quantity: req.body.quantity,
    price: req.body.price,
    supplierId: req.body.supplierId,
    reorderLevel: req.body.reorderLevel,
    status: req.body.status
  });
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an inventory item
router.put('/:id', getItem, async (req, res) => {
  if (req.body.name != null) {
    res.item.name = req.body.name;
  }
  if (req.body.description != null) {
    res.item.description = req.body.description;
  }
  if (req.body.category != null) {
    res.item.category = req.body.category;
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
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an inventory item
router.delete('/:id', getItem, async (req, res) => {
  try {
    await res.item.remove();
    res.json({ message: 'Deleted Inventory Item' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get inventory item by ID
async function getItem(req, res, next) {
  let item;
  try {
    item = await InventoryItem.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find inventory item' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.item = item;
  next();
}

module.exports = router;
