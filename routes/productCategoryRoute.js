const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCategory, getCategories, getCategoryById, deleteCategory, updateCategory } = require('../controller/productCategoryController');
const router = express.Router();

router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);
module.exports = router;
