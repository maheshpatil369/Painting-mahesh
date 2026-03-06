const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/authmiddleware');
const upload = require('../utils/s3Upload'); // New utility for S3
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

// Admin-only routes - Using upload.single('image') to handle S3 upload
router.post('/', requireAuth, requireRole('ADMIN'), upload.single('image'), createProduct);
router.put('/:id', requireAuth, requireRole('ADMIN'), upload.single('image'), updateProduct);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteProduct);

module.exports = router;