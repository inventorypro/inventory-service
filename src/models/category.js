const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
});

const Category = mongoose.model('Categories', categorySchema);

module.exports = Category;
