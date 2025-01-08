const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const logger = require('../logger');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /files/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       500:
 *         description: Server error
 */
router.post('/upload', upload.single('file'), (req, res) => {
  logger.info({ file: req.file }, 'File upload started');
  try {
    res
      .status(200)
      .json({ message: 'File uploaded successfully', file: req.file });
    logger.info({ file: req.file }, 'File uploaded successfully');
  } catch (error) {
    logger.error({ error }, 'File upload errored');
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /files/download/{filename}:
 *   get:
 *     summary: Download a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to download
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  logger.info({ filePath }, 'File download started');
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      logger.warn({ filePath }, 'File not found');
      return res.status(404).json({ message: 'File not found' });
    }
    res.download(filePath, (err) => {
      if (err) {
        logger.error({ err }, 'File download errored');
        res.status(500).json({ message: err.message });
      } else {
        logger.info({ filePath }, 'File downloaded successfully');
      }
    });
  });
});

module.exports = router;
