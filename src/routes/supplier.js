const express = require('express');
const router = express.Router();
const logger = require('../logger');
const Supplier = require('../models/supplier');

// Middleware to get supplier by ID
async function getSupplier(req, res, next) {
  let supplier;
  try {
    logger.info({ supplierId: req.params.id }, 'Query to find supplier by ID started');

    supplier = await Supplier.findById(req.params.id);
    if (supplier == null) {
      logger.warn({ supplierId: req.params.id }, 'Cannot find the supplier');
      return res.status(404).json({ message: 'Cannot find supplier' });
    }
  } catch (error) {
    logger.error({ error, supplierId: req.params.id }, 'Query to find supplier by ID errored');
    return res.status(500).json({ message: error.message });
  }

  res.supplier = supplier;
  next();
}

// GET /suppliers - Retrieves a list of all suppliers
router.get('/', async (req, res) => {
  logger.info('Request to get all suppliers started');
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
    logger.info('Request to get all suppliers completed');
  } catch (error) {
    logger.error({ error }, 'Query to get all suppliers errored');
    res.status(500).json({ message: error.message });
  }
});

// GET /suppliers/:id - Retrieves a specific supplier by its ID
router.get('/:id', getSupplier, (req, res) => {
  logger.info({ supplierId: req.params.id }, 'Request to get supplier by ID started');
  res.json(res.supplier);
  logger.info({ supplierId: req.params.id }, 'Request to get supplier by ID completed');
});

// POST /suppliers - Creates a new supplier
router.post('/', async (req, res) => {
  logger.info({ payload: req.body }, 'Request to create new supplier started');
  const supplier = new Supplier({
    name: req.body.name,
    contactInfo: req.body.contactInfo,
    address: req.body.address
  });

  try {
    const newSupplier = await supplier.save();
    res.status(201).json(newSupplier);
    logger.info({ newSupplier }, 'Supplier created successfully');
  } catch (error) {
    logger.error({ error, payload: req.body }, 'Request to create new supplier errored');
    res.status(400).json({ message: error.message });
  }
});

// PUT /suppliers/:id - Updates an existing supplier by its ID
router.put('/:id', getSupplier, async (req, res) => {
  logger.info({ supplierId: req.params.id, payload: req.body }, 'Request to update supplier started');

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
    logger.info({ supplierId: req.params.id, updatedSupplier }, 'Supplier updated successfully');
  } catch (error) {
    logger.error({ error, supplierId: req.params.id }, 'Request to update supplier errored');
    res.status(400).json({ message: error.message });
  }
});

// DELETE /suppliers/:id - Deletes a supplier by its ID
router.delete('/:id', getSupplier, async (req, res) => {
  logger.info({ supplierId: req.params.id }, 'Request to delete supplier started');
  try {
    await Supplier.deleteOne({ supplierId: req.params.id });
    res.json({ message: 'Deleted Supplier' });
    logger.info({ supplierId: req.params.id }, 'Supplier deleted successfully');
  } catch (error) {
    logger.error({ error, supplierId: req.params.id }, 'Request to delete supplier errored');
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
