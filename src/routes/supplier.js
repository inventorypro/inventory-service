const express = require('express');
const router = express.Router();
const Supplier = require('../models/supplier');

// GET /suppliers - Retrieves a list of all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /suppliers/:id - Retrieves a specific supplier by its ID
router.get('/:id', getSupplier, (req, res) => {
  res.json(res.supplier);
});

// POST /suppliers - Creates a new supplier
router.post('/', async (req, res) => {
  const supplier = new Supplier({
    name: req.body.name,
    contactInfo: req.body.contactInfo,
    address: req.body.address
  });
  try {
    const newSupplier = await supplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /suppliers/:id - Updates an existing supplier by its ID
router.put('/:id', getSupplier, async (req, res) => {
  if (req.body.name != null) {
    res.supplier.name = req.body.name;
  }
  if (req.body.contactInfo != null) {
    res.supplier.contactInfo = req.body.contactInfo;
  }
  if (req.body.address != null) {
    res.supplier.address = req.body.address;
  }
  try {
    const updatedSupplier = await res.supplier.save();
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /suppliers/:id - Deletes a supplier by its ID
router.delete('/:id', getSupplier, async (req, res) => {
  try {
    await res.supplier.remove();
    res.json({ message: 'Deleted Supplier' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get supplier by ID
async function getSupplier(req, res, next) {
  let supplier;
  try {
    supplier = await Supplier.findById(req.params.id);
    if (supplier == null) {
      return res.status(404).json({ message: 'Cannot find supplier' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.supplier = supplier;
  next();
}

module.exports = router;
