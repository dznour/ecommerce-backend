const express = require('express');
const { createUser,
    loginUser,
    getUsers,
    getUserByID,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logoutUser,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    addToWishList,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.put('/wishlist', authMiddleware, addToWishList);
router.get('/wishlist', authMiddleware, getWishlist);
router.post('/register', createUser);
router.post('/cart', authMiddleware, userCart);
router.get('/cart', authMiddleware, getUserCart);
router.post('/cart/apply-coupon', authMiddleware, applyCoupon);
router.post('/cart/order', authMiddleware, createOrder);
router.get('/cart/order', authMiddleware, getOrders);
router.put('/cart/order/:id', authMiddleware, isAdmin, updateOrderStatus);

router.delete('/cart', authMiddleware, emptyCart);
router.put('/password', authMiddleware, updatePassword);
router.post('/forgot-password', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.post('/login', loginUser);
router.post('/admin', loginAdmin);
router.get('/logout', logoutUser);
router.get('/', getUsers);
router.get('/refresh', handleRefreshToken);
router.get('/:id', authMiddleware, isAdmin, getUserByID);
router.delete('/:id', deleteUser);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/address', authMiddleware, saveAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;