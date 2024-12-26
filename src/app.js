const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const inventoryRouter = require('./routes/inventory');
const categoriesRouter = require('./routes/categories');
const stockLevelsRouter = require('./routes/stockLevels');
const supplierRouter = require('./routes/supplier')

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://34.135.18.174:27017/inventory', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use('/inventory', inventoryRouter);
app.use('/inventory/categories', categoriesRouter);
app.use('/inventory/stock-levels', stockLevelsRouter);
app.use('/inventory/suppliers', supplierRouter);

app.listen(3000, () => console.log('Server Started'));
