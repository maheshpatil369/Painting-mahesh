const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional - for guest orders
  status: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED', 'COMPLETED'], 
    default: 'PENDING' 
  },
  total: { type: Number, required: true }, // Total amount in INR
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 250 }, // Shipping cost
  currency: { type: String, default: 'INR' },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  paymentMethod: { type: String, default: 'COD' }, // Cash on Delivery
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
