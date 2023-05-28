const Category = require('../models/productCategoryModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbID');

// Create new Category

const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory)
    } catch (error) {
        throw new Error(error);
    }
});

// Get All Categories

const getCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories)
    } catch (error) {
        throw new Error(error)
    }
})

// Get Category By ID
const getCategoryById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const categories = await Category.findById(id);
        res.json(categories)
    } catch (error) {
        throw new Error(error)
    }
})

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            req.body,
            { new: true });
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error);
    }
})

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory)
    } catch (error) {
        throw new Error(error);
    }
})
module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
}