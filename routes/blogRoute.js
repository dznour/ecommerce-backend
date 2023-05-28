const express = require('express');
const { createBlog, updateBlog, getAllBlogs, getBlogByID, deleteBlog, likeBlog, dislikeBlog, uploadImage } = require('../controller/blogController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { blogImgResize, uploadPhoto } = require('../middlewares/uploadImages');
const router = express.Router();

router.get('/', getAllBlogs)
router.get('/:id', getBlogByID)
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), blogImgResize, uploadImage)
router.put('/like/', authMiddleware, likeBlog)
router.put('/dislike/', authMiddleware, dislikeBlog)
router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)

router.delete('/:id', authMiddleware, isAdmin, deleteBlog)
module.exports = router;