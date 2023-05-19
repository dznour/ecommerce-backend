const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
// Create User Controller
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        // Create New User
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        //User Already Exists
        throw new Error('User Already Registred With This Email!');
    }
});

// Login User Controller

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    // Check if user exists or not by Email
    const findUser = await User.findOne({ email });
    // If Email Exists -> Check if password is correct
    if (findUser && await findUser.isPasswirdMatched(password)) {
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            role: findUser?.role,
            token: generateToken(findUser._id)
        });
    } else {
        throw new Error('Invalid Credentials');
    }
})
// Get All Users

const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        throw new Error(error);
    }
});

// Get Single User

const getUserByID = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        res.json(user)
    } catch (error) {
        throw new Error(error);
    }
});

// Delete A User

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const users = await User.findByIdAndDelete(id);
        res.json({ users });
    } catch (error) {
        throw new Error(error);
    }
});

// Update A User

const updateUser = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await User.findByIdAndUpdate(_id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        }, { new: true });
        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id,
            { isBlocked: true, },
            { new: true }
        );
        res.json(user)
    } catch (error) {
        throw new Error(error);
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id,
            { isBlocked: false, },
            { new: true }
        );
        res.json({ user })
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = {
    createUser,
    loginUser,
    getUsers,
    getUserByID,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser
};