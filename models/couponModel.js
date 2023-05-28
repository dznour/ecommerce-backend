const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var couponModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    expireAt: {
        type: Date,
        require: true,
    },
    discount: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0 && value <= 100;
            },
            message: 'Discount should be greater than 0 and less than or equal to 100.',
        }
    },

});

//Export the model
module.exports = mongoose.model('Coupon', couponModel);