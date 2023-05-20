const express = require('express');
const { createUser, loginUser, getUsers, getUserByID, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logoutUser } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/', getUsers);
router.get('/refresh', handleRefreshToken);
router.get('/:id', authMiddleware, isAdmin, getUserByID);
router.delete('/:id', deleteUser);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);
module.exports = router;