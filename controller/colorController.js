const Color = require('../models/colorModel');
const asyncHander = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

// Get All Colors

const getColors = asyncHander(async (req, res) => {
    try {
        const colors = await Color.find();
        res.json(colors);
    } catch (error) {
        throw new Error(error);
    }
})

// Get   By ID

const getColor = asyncHander(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const color = await Color.findById(id);
        res.json(color);
    } catch (error) {
        throw new Error(error);
    }
})

// Create New 

const createColor = asyncHander(async (req, res) => {
    try {
        const newColor = await Color.create(req.body);
        res.json(newColor);
    } catch (error) {
        throw new Error(error)
    }
})

// Update Color 
const updateColor = asyncHander(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const updatedColor = await Color.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedColor);
    } catch (error) {
        throw new Error(error)
    }
})
// Delete Color 
const deleteColor = asyncHander(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const deletedColor = await Color.findByIdAndDelete(id);
        res.json(deletedColor);
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    getColors,
    getColor,
    createColor,
    updateColor,
    deleteColor,
}