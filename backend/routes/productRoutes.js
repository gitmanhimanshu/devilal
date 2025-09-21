const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands
} = require('../controllers/productController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Public routes (anyone can view products)
router.get('/', optionalAuth, getProducts);
router.get('/:id', optionalAuth, getProduct);
router.get('/meta/categories', getCategories);
router.get('/meta/brands', getBrands);

// Protected routes (only admins can manage products)
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;