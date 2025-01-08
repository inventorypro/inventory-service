const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactInfo: { type: String },
  address: { type: String },
});

module.exports =
  mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
