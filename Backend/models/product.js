const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true }, // Price in INR (matches frontend)
  image: { type: String }, // Single image URL (matches frontend)
  tag: { type: String }, // Optional tag like 'Best Seller', 'New', etc.
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true, sparse: true }, // Optional SKU
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
