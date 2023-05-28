const express = require('express');
const {
    getBlogCategories,
    getBlogCategory,
    createBlogCategory,
    updateBlogCategory,
    deleteBlogCategory
} = require('../controller/blogCategoryController');
const router = express.Router();


router.get('/', getBlogCategories)
router.get('/:id', getBlogCategory)
router.post('/', createBlogCategory)
router.put('/:id', updateBlogCategory)
router.delete('/:id', deleteBlogCategory)
module.exports = router;