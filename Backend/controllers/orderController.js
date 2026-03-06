const Order = require('../models/order');
const Product = require('../models/product');

// POST create new order (guest or authenticated user)
async function createOrder(req, res) {
  try {
    // User ID is optional - if user is logged in, use it; otherwise null for guest orders
    const userId = req.user ? req.user.sub : null;
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      // Verify product exists - try by ID first, then by name
      let product = null;
      const productId = item.productId || item.id;
      
      // Check if it's a valid MongoDB ObjectId
      if (productId && productId.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(productId);
      }
      
      // If not found by ID, try to find by name
      if (!product && item.name) {
        product = await Product.findOne({ name: item.name });
      }
      
      if (!product) {
        return res.status(400).json({ message: `Product ${item.name || productId} not found` });
      }

      const quantity = item.quantity || 1;
      const price = product.price;
      const itemTotal = price * quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        category: product.category,
        price: price,
        quantity: quantity,
        image: product.image
      });
    }

    const shipping = 250; // Fixed shipping cost
    const total = subtotal + shipping;

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      subtotal,
      shipping,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      status: 'PENDING'
    });

    await order.save();
    
    // Populate user info for response (if user exists)
    if (userId) {
      await order.populate('user', 'name email');
    }
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
}

// GET user's orders (authenticated user)
async function getUserOrders(req, res) {
  try {
    const userId = req.user.sub;
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name image');
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

// GET single order by ID (authenticated user - own orders only, or admin)
async function getOrderById(req, res) {
  try {
    const userId = req.user.sub;
    const userRole = req.user.role;
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('items.productId', 'name image category');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Users can only view their own orders, admins can view all
    if (userRole !== 'ADMIN' && order.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById
};

