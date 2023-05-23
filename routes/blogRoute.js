const express = require('express');
const { createBlog, updateBlog, getAllBlogs, getBlogByID, deleteBlog, likeBlog, dislikeBlog } = require('../controller/blogController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllBlogs)
router.get('/:id', getBlogByID)
router.put('/like/', authMiddleware, likeBlog)
router.put('/dislike/', authMiddleware, dislikeBlog)
router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)

router.delete('/:id', authMiddleware, isAdmin, deleteBlog)
module.exports = router;