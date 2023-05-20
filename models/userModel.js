const mongoose = require('mongoose'); // Erase if already required

const bcrypt = require('bcrypt');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address: {
        type: String,
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    refreshToken: {
        type: String,
    }
},

    {
        timestamps: true
    });

// Hash the password
userSchema.pre('save', async function (next) {
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.isPasswirdMatched = async function (givenPassword) {
    return await bcrypt.compare(givenPassword, this.password);
}
//Export the model
module.exports = mongoose.model('User', userSchema);