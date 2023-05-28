const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');


// Get All Coupons
const getCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        throw new Error(error);
    }
})

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
})

const updateCoupon = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const newCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
})

const deleteCoupon = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const newCoupon = await Coupon.findByIdAndDelete(id);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
}

