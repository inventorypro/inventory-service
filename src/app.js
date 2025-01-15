const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const swaggerSetup = require('./swagger');
const logger = require('./logger');
const inventoryRouter = require('./routes/inventory');
const categoriesRouter = require('./routes/categories');
const stockLevelsRouter = require('./routes/stockLevels');
const supplierRouter = require('./routes/supplier');
const filesRouter = require('./routes/files');

const app = express();

swaggerSetup(app);
app.use(require('express-pino-logger')({ logger }));
app.use(bodyParser.json());

const connectToDatabase = async (mongoURI) => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', (error) => console.error(error));
  db.once('open', () => console.log('Connected to Database'));
};

app.use('/inventory', inventoryRouter);
app.use('/categories', categoriesRouter);
app.use('/inventory/stock-level', stockLevelsRouter);
app.use('/suppliers', supplierRouter);
app.use('/files', filesRouter);

// Export the app object and the connectToDatabase function
module.exports = { app, connectToDatabase };
const mongoURI = process.env.MONGO_URI || 'localhost:27017';
// Start the server only if this file is run directly
if (require.main === module) {
  connectToDatabase(`mongodb://${mongoURI}/inventory`).then(() => {
    app.listen(3000, () => console.log('Server Started'));
  });
}
