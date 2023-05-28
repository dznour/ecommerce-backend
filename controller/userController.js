const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailController');
const crypto = require('crypto');
const uniqid = require('uniqid')
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
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(
            findUser?._id,
            {
                refreshToken: refreshToken
            },
            { new: true })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
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
// Login Admin Controller

const loginAdmin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    // Check if user exists or not by Email
    const findUser = await User.findOne({ email });
    // If Email Exists -> Check if password is correct
    if (findUser && await findUser.isPasswirdMatched(password)) {
        if (findUser.role !== 'admin') {
            throw new Error('Not Authorized!')
        } else {
            const refreshToken = await generateRefreshToken(findUser?._id);
            const updateUser = await User.findByIdAndUpdate(
                findUser?._id,
                {
                    refreshToken: refreshToken
                },
                { new: true })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000
            })
            res.json({
                _id: findUser?._id,
                firstName: findUser?.firstName,
                lastName: findUser?.lastName,
                email: findUser?.email,
                mobile: findUser?.mobile,
                role: findUser?.role,
                token: generateToken(findUser._id)
            });
        }
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
    validateMongoDbId(id);
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
        validateMongoDbId(id);
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
        validateMongoDbId(_id);
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

// Block A User
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
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

// Unblock A User
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
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

// Handle Refresh Token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) throw new Error('No Refresh Token In Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({
        refreshToken
    })
    if (!user) throw new Error('No User Was Found With This Token');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error('There is something wrong with refresh token');
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });

})

// Logout User

const logoutUser = asyncHandler(async (req, res, next) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error('No Refresh Token Was Found In Cookies')
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204); // Forbiden
    }
    await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: ''
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    return res.sendStatus(204);
})

// Update Passowrd

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
})

// Generate Forget Password Token
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('There Is No User Found With This Email');
    }
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please Follow This Link To Reset Your Password. <a href='http://localhost:4000/api/users/reset-password/${token}'>Password Reset</a>. </br> <b>This Link Will Be Expired In 30Mins</b>`
        const data = {
            to: email,
            subject: 'Password Reset',
            html: resetURL,
            text: `Hi ${user.firstName} ${user.lastName}, `
        }
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
})

// Reset Password

const resetPassword = asyncHandler(async (req, res) => {
    console.log('HELLO')
    const { token } = req.params;
    try {
        const { password } = req.body;
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
                $gt: Date.now()
            }
        })
        if (!user) {
            throw new Error('Link Not Valid Or Has Already Expired')
        }
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});

const addToWishList = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;
        const { productId } = req.body;
        let user = await User.findById(_id)
        const isAlreadyAdded = user.wishlist.find((id) => id.toString() === productId.toString());
        if (isAlreadyAdded) {
            user = await User.findByIdAndUpdate(_id, {
                $pull: {
                    wishlist: productId
                }
            }, { new: true })
        } else {
            user = await User.findByIdAndUpdate(_id, {
                $push: {
                    wishlist: productId
                }
            }, { new: true })
        }
        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
})

const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const user = await User.findById(_id).populate('wishlist');
        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
})

const saveAddress = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await User.findByIdAndUpdate(_id, {
            address: req.body?.address
        }, {
            new: true
        });
        res.json(user);
    } catch (error) {
        throw new Error()
    }
});

const userCart = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;
        validateMongoDbId(_id);
        const { cart } = req.body;
        const user = await User.findById(_id);
        // Check if user already have products in cart
        const alreadyExistCart = await Cart.findOne({
            orderBy: user._id
        });
        if (alreadyExistCart) {
            await alreadyExistCart.deleteOne()
        }
        let products = [];
        for (let i = 0; i < cart.length; i++) {
            let obj = {};
            obj.product = cart[i]._id;
            obj.count = cart[i].count;
            obj.color = cart[i].color;
            let getPrice = await Product.
                findById(cart[i]._id).
                select('price').exec()
            obj.price = getPrice.price;
            products.push(obj)
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal += products[i].price * products[i].count
        }
        cartTotal = Math.round(cartTotal * 100) / 100

        let newCart = await new Cart({
            products,
            cartTotal,
            orderBy: user._id,
        }).save()
        res.json(newCart)
    } catch (error) {
        throw new Error(error);
    }
})

const getUserCart = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;
        validateMongoDbId(_id);
        const cart = await Cart.findOne({
            orderBy: _id
        }).populate('products.product',)
        res.json(cart ?? []);
    } catch (error) {
        throw new Error(error);
    }
})

const emptyCart = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;
        validateMongoDbId(_id);
        const cart = await Cart.findOneAndDelete({
            orderBy: _id
        })
        res.json(cart)
    } catch (error) {
        throw new Error(error);
    }
})

const applyCoupon = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;
        const { coupon } = req.body;
        const validCoupon = await Coupon.findOne({
            name: coupon
        })
        if (validCoupon) {
            if (Date.now() > validCoupon.expireAt) {
                res.json('Expired')
            } else {
                const discount = validCoupon.discount;
                const cart = await Cart.findOne({
                    orderBy: _id
                })
                if (cart) {
                    let totalAfterDiscount = cart.cartTotal - (cart.cartTotal * discount / 100);
                    cart.totalAfterDiscount = Math.round(totalAfterDiscount * 100) / 100
                    await cart.save();
                    res.json(cart)
                } else {
                    throw new Error("The user's cart is empty!")
                }
            }
        } else {
            throw new Error('Coupon Not Valid')
        }

    } catch (error) {
        throw new Error(error)
    }
})

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { COD, coupondApplied } = req.body;
        const { _id } = req.user;
        validateMongoDbId(_id);
        if (!COD) throw new Error('Create Order Failed!');
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({
            orderBy: _id
        });
        let finalAmount = 0;
        if (coupondApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount
        } else {
            finalAmount = userCart.cartTotal
        }

        let newOrder = await new Order(
            {
                products: userCart.products,
                paymentIntent: {
                    id: uniqid(),
                    method: 'COD',
                    amount: finalAmount,
                    status: "Cash on Delivery",
                    created: Date.now(),
                    currency: "usd",
                },
                orderBy: _id,
                orderStatus: "Cash on Delivery",
            }
        ).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            }
        })
        const updated = await Product.bulkWrite(update, {});
        res.json({
            message: "success"
        })
    } catch (error) {
        throw new Error(error);
    }
})

const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const orders = await Order.find({
            orderBy: _id
        }).populate('products.product').exec()
        res.json(orders)
    } catch (error) {
        throw new Error(error)
    }
})

const updateOrderStatus = asyncHandler(async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        validateMongoDbId(id);
        const updateOrder = await Order.findById(id)
        updateOrder.orderStatus = status;
        updateOrder.paymentIntent.status = status;
        await updateOrder.save();
        res.json(updateOrder)
    } catch (error) {
        throw new Error(error);
    }
})
module.exports = {
    createUser,
    loginUser,
    loginAdmin,
    getUsers,
    getUserByID,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    logoutUser,
    handleRefreshToken,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    addToWishList,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus
};