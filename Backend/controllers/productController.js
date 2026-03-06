// productController.js

const Product = require('../models/product');

// POST create new product
async function createProduct(req, res) {
  try {
    const { name, description, category, price, tag, stock, sku } = req.body;
    
    // Map uploaded file locations from S3
    const imageUrls = req.files ? req.files.map(file => file.location) : [];

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    const product = new Product({
      name,
      description,
      category,
      price: Number(price),
      images: imageUrls, // Store the array of S3 URLs
      tag,
      stock: Number(stock) || 0,
      sku
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }
    res.status(500).json({ message: 'Failed to create product' });
  }
}

// PUT update product
async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const updates = { ...req.body };
    
    // If new images are uploaded, replace the images array
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => file.location);
    }

    if (updates.price) updates.price = Number(updates.price);
    if (updates.stock) updates.stock = Number(updates.stock);

    Object.assign(product, updates);
    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
}

// GET all products
async function getAllProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
}

// GET single product
async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
}

// DELETE product
async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };