const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true }, 
  images: [{ type: String }], // Array to store multiple S3 URLs
  image: { type: String },    // Main thumbnail for backward compatibility
  tag: { type: String }, 
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true, sparse: true }, 
}, { timestamps: true });

// Sync 'image' with the first element of 'images' before saving
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    this.image = this.images[0];
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);