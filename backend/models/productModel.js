import mongoose from 'mongoose' // Package

const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },  // Individual rating review
    comment: { type: String, required: true },
    user: { // Userfield to know which user is creating this review
        type: mongoose.Schema.Types.ObjectId,   // Object ID
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const productSchema = mongoose.Schema({    // Passing an Object
    user: { // Userfield to know which Admin is creating this product
        type: mongoose.Schema.Types.ObjectId,   // Object ID
        required: true,
        ref: 'User' // A relationship between the product and the user
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reviews: [reviewSchema], // Reviews is going to be an Array Object
    rating: {   // Average rating review
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true    // Second argument to create above fields automatically
})

const Product = mongoose.model('Product', productSchema) // Creating Product as Model

export default Product