const Enquiry = require('../models/enquiryModel')
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

// Create New Enquiry

const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.json(newEnquiry);
    } catch (error) {
        throw new Error(error);
    }
})

const getEnquiries = asyncHandler(async (req, res) => {
    try {
        const enquiries = await Enquiry.find();
        res.json(enquiries)
    } catch (error) {
        throw new Error(error);
    }
})

const getEnquiry = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id)
        const enquiries = Enquiry.findById(id);
        res.json(enquiries)
    } catch (error) {
        throw new Error(error);
    }
})

const updateEnquiry = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id)
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updatedEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteEnquiry = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id)
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id)
        res.json(deletedEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})



module.exports = {
    createEnquiry,
    getEnquiries,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry
}