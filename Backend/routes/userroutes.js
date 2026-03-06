const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/authmiddleware');
const { getUserOrders } = require('../controllers/orderController');
const User = require('../models/user');

// Get user's own orders
router.get('/orders', requireAuth, getUserOrders);

// Admin route to get all users
router.get('/', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json({ users });
});

module.exports = router;
