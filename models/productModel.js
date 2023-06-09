const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        //type: mongoose.Schema.Types.ObjectId,
        //ref: 'Category'
        type: String,
        required: true
    },
    brand: {
        //type: String,
        //enum: ['Apple', 'Sumsung', 'Sony'],
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0,
        select: false
    },
    images: {
        type: Array
    },
    color: [
    ],
    sold: {
        type: Number,
        default: 0,
        select: false
    },
    ratings: [
        {
            star: {
                type: Number
            },
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            comment: {
                type: String
            }
        }
    ],
    totalrating: {
        type: String,
        default: '0'
    }

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Product', productSchema);