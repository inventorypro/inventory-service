const express = require('express');
const router = express.Router();
const logger = require('../logger');
const Category = require('../models/category');

// Middleware to get category by ID
async function getCategory(req, res, next) {
  let category;
  try {
    logger.info(
      { categoryId: req.params.categoryId },
      'Query to find category by ID started'
    );

    category = await Category.findById(req.params.categoryId);
    if (category == null) {
      logger.warn(
        { categoryId: req.params.categoryId },
        'Cannot find the category'
      );
      return res.status(404).json({ message: 'Cannot find category' });
    }
  } catch (err) {
    logger.error(
      { err, categoryId: req.params.categoryId },
      'Query to find category by ID errored'
    );
    return res.status(500).json({ message: err.message });
  }

  res.category = category;
  next();
}

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  logger.info('Request to get categories started');
  try {
    const categories = await Category.find();
    res.json(categories);

    logger.info('Request to get categories completed');
  } catch (err) {
    logger.error({ err }, 'Query to get categories errored');
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /categories/{categoryId}:
 *   get:
 *     summary: Retrieve a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: A single category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get('/:categoryId', getCategory, (req, res) => {
  logger.info(
    { categoryId: req.params.categoryId },
    'Request to get category by ID started'
  );
  res.json(res.category);
  logger.info(
    { categoryId: req.params.categoryId },
    'Request to get category by ID completed'
  );
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: The created category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
  logger.info({ payload: req.body }, 'Request to create category started');
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    logger.info({ payload: req.body }, 'Saving new category');
    const newCategory = await category.save();
    res.status(201).json(newCategory);
    logger.info({ newCategory }, 'Category created successfully');
  } catch (err) {
    logger.error(
      { err, payload: req.body },
      'Request to create category errored'
    );
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /categories/{categoryId}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The updated category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put('/:categoryId', getCategory, async (req, res) => {
  logger.info(
    { categoryId: req.params.categoryId, payload: req.body },
    'Request to update category started'
  );

  if (req.body.name != null) {
    res.category.name = req.body.name;
  }
  if (req.body.description != null) {
    res.category.description = req.body.description;
  }

  try {
    const updatedCategory = await res.category.save();
    res.json(updatedCategory);
    logger.info(
      { categoryId: req.params.categoryId, updatedCategory },
      'Category updated successfully'
    );
  } catch (err) {
    logger.error(
      { err, categoryId: req.params.categoryId },
      'Request to update category errored'
    );
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /categories/{categoryId}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete('/:categoryId', getCategory, async (req, res) => {
  logger.info(
    { categoryId: req.params.categoryId },
    'Request to delete category started'
  );
  try {
    await Category.deleteOne({ _id: res.category._id });
    res.json({ message: 'Deleted Category' });
    logger.info(
      { categoryId: req.params.categoryId },
      'Category deleted successfully'
    );
  } catch (err) {
    logger.error(
      { err, categoryId: req.params.categoryId },
      'Request to delete category errored'
    );
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
