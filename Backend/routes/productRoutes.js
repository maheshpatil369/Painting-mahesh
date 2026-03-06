const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/authmiddleware');
const upload = require('../utils/s3Upload');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin-only routes
// .array('images', 10) allows up to 10 images at once
router.post('/', requireAuth, requireRole('ADMIN'), upload.array('images', 10), createProduct);
router.put('/:id', requireAuth, requireRole('ADMIN'), upload.array('images', 10), updateProduct);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteProduct);

module.exports = router;