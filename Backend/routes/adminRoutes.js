// routes/adminRoutes.js (UPDATE)

const express = require('express');
const router = express.Router();
// 🔑 IMPORT your existing middleware
const { requireAuth, requireRole } = require('../middleware/authmiddleware'); 
const User = require('../models/user');
// ⚠️ Assuming your Order model is correctly imported and named 'Order'
const Order = require('../models/order'); 


// 1. 🛡️ GET all users - Protected by ADMIN role
// Note: requireAuth must run before requireRole
router.get('/users', requireAuth, requireRole('ADMIN'), async (req, res) => {
    try {
        // You used '-password' before, but your model uses 'passwordHash'
        const users = await User.find({}).select('-passwordHash'); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
});

// 2. 🛡️ GET all orders - Protected by ADMIN role
router.get('/orders', requireAuth, requireRole('ADMIN'), async (req, res) => {
    try {
        // Fetch orders and populate the user details for the dashboard view
        const orders = await Order.find({})
             // ⚠️ Assuming the field linking to User is named 'user' in the Order model
            .populate('user', 'name email') 
            .sort({ createdAt: -1 }); 
            
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders.' });
    }
});

module.exports = router;