const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
// Fetch All Products
const getProducts = asyncHandler(async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((e) => delete queryObj[e]);
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|le)\b/g, (match) => `$${match}`)
        console.log(JSON.parse(queryString));
        let query = Product.find(JSON.parse(queryString))


        //Sorting

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        // Limiting the fields

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }


        // Pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error('This Page Does Not Exist')
        }
        const products = await query;
        res.json(products)
    } catch (error) {
        throw new Error(error);
    }

});

// Fetch All Products
const getProductByID = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id);
        res.json(product)
    } catch (error) {
        throw new Error(error);
    }

});
// Create new Product
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// Update a Product

const updateProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true })
        res.json(updatedProduct);
    } catch (error) {
        console.log(error)

        throw new Error(error);
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id)
        res.json(deletedProduct);
    } catch (error) {
        console.log(error)

        throw new Error(error);
    }
})


module.exports = {
    getProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct,
};