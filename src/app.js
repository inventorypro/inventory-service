const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const logger = require('./logger');
const inventoryRouter = require('./routes/inventory');
const categoriesRouter = require('./routes/categories');
const stockLevelsRouter = require('./routes/stockLevels');
const supplierRouter = require('./routes/supplier');


const mongoURI = process.env.MONGO_URI || 'localhost:27017';

const app = express();

app.use(require('express-pino-logger')({ logger }));
app.use(bodyParser.json());

mongoose.connect(`mongodb://${mongoURI}/inventory`, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use('/inventory', inventoryRouter);
app.use('/inventory/categories', categoriesRouter);
app.use('/inventory/stock-level', stockLevelsRouter);
app.use('/inventory/suppliers', supplierRouter);

app.listen(3000, () => console.log('Server Started'));
