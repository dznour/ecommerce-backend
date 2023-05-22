const express = require('express');
const { createProduct, getProducts, getProductByID, updateProduct, deleteProduct } = require('../controller/productController');
const { isAdmin } = require('../middlewares/authMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductByID);
router.post('/', authMiddleware, isAdmin, createProduct);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;