const Product = require('../models/product');

// GET all products (public endpoint)
async function getAllProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
}

// GET single product by ID (public endpoint)
async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
}


// POST create new product
async function createProduct(req, res) {
  try {
    const { name, description, category, price, tag, stock } = req.body;
    
    // req.file.location contains the public S3 URL
    const imageUrl = req.file ? req.file.location : req.body.image;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    const product = new Product({
      name,
      description,
      category,
      price: Number(price),
      image: imageUrl, 
      tag,
      stock: Number(stock) || 0
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
}

// PUT update product
async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updates = { ...req.body };
    if (req.file) updates.image = req.file.location; // Update image if new file uploaded

    // Apply updates
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) product[key] = updates[key];
    });

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product' });
  }
}

// PUT update product (admin only)
async function updateProduct(req, res) {
  try {
    const { name, description, category, price, image, tag, stock } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (image !== undefined) product.image = image;
    if (tag !== undefined) product.tag = tag;
    if (stock !== undefined) product.stock = Number(stock);

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
}

// DELETE product (admin only)
async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

