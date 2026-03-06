const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authmiddleware');
const {
  createOrder,
  getOrderById
} = require('../controllers/orderController');

// Order creation is public (no auth required) - guest checkout allowed
router.post('/', createOrder);
// Viewing orders still requires authentication
router.get('/:id', requireAuth, getOrderById);

module.exports = router;

