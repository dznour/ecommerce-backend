const express = require('express');
const {
    createProduct,
    getProducts,
    getProductByID,
    updateProduct,
    deleteProduct,
    rating, uploadImages, deleteImages } = require('../controller/productController');
const { isAdmin } = require('../middlewares/authMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductByID);
router.post('/', authMiddleware, isAdmin, createProduct);
router.put('/upload/', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages)
router.put('/rating', authMiddleware, rating);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);
router.delete('/delete-img/:id', authMiddleware, isAdmin, deleteImages);

module.exports = router;