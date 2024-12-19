const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// GET /inventory/categories - Retrieves a list of all inventory categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /inventory/categories/:categoryId - Retrieves details of a specific inventory category by its ID
router.get('/:categoryId', getCategory, (req, res) => {
  res.json(res.category);
});

// POST /inventory/categories - Adds a new inventory category
router.post('/', async (req, res) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /inventory/categories/:categoryId - Updates an existing inventory category by its ID
router.put('/:categoryId', getCategory, async (req, res) => {
  if (req.body.name != null) {
    res.category.name = req.body.name;
  }
  if (req.body.description != null) {
    res.category.description = req.body.description;
  }

  try {
    const updatedCategory = await res.category.save();
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /inventory/categories/:categoryId - Deletes an existing inventory category by its ID
router.delete('/:categoryId', getCategory, async (req, res) => {
  try {
    await res.category.remove();
    res.json({ message: 'Deleted Category' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get category by ID
async function getCategory(req, res, next) {
  let category;
  try {
    category = await Category.findById(req.params.categoryId);
    if (category == null) {
      return res.status(404).json({ message: 'Cannot find category' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.category = category;
  next();
}

module.exports = router;
