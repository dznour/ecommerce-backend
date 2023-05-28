const Brand = require('../models/brandModel');
const asyncHander = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbID');

// Get All Brands

const getBrands = asyncHander(async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (error) {
        throw new Error(error);
    }
})

// Get   By ID

const getBrand = asyncHander(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const brand = await Brand.findById(id);
        res.json(brand);
    } catch (error) {
        throw new Error(error);
    }
})

// Create New 

const createBrand = asyncHander(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch (error) {
        throw new Error(error)
    }
})

// Update Brand 
const updateBrand = asyncHander(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedBrand);
    } catch (error) {
        throw new Error(error)
    }
})
// Delete Brand 
const deleteBrand = asyncHander(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.json(deletedBrand);
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
}