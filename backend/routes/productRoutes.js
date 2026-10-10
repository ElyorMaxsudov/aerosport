const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, sellerOrAdmin } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/seller/my-products', protect, sellerOrAdmin, getMyProducts);
router.get('/:id', getProductById);
router.post('/', protect, sellerOrAdmin, createProduct);
router.put('/:id', protect, sellerOrAdmin, updateProduct);
router.delete('/:id', protect, sellerOrAdmin, deleteProduct);

module.exports = router;
