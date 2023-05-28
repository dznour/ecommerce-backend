const express = require('express');
const { getBrands, getBrand, createBrand, updateBrand, deleteBrand } = require('../controller/brandController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getBrands);
router.get('/:id', getBrand);
router.post('/', authMiddleware, isAdmin, createBrand)
router.put('/:id', authMiddleware, isAdmin, updateBrand)
router.delete('/:id', authMiddleware, isAdmin, deleteBrand)
module.exports = router;