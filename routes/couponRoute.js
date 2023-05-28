const express = require('express');
const { getCoupons, createCoupon, updateCoupon, deleteCoupon } = require('../controller/couponController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, isAdmin, getCoupons);
router.post('/', authMiddleware, isAdmin, createCoupon);
router.put('/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);
module.exports = router;