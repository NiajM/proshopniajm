import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

//  @desc   Fetch all products
//  @route  GET /api/products
//  @access Public
const getProducts = asyncHandler(async (req, res) => {

    const pageSize = 100

    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,   // $regex finds the similar name or string matching with given keyword
            $options: 'i'   // makes the search case-insensetive
        }
    } : {}

    const count = await Product.countDocuments({ ...keyword })

    const products = await Product.find({ ...keyword }).sort({ updatedAt: -1 }).limit(pageSize).skip(pageSize * (page-1))
    
	// if (products && (products.length !== 0)) {
    //     products.sort((a, b) => {
    //         return new Date(b.updatedAt) - new Date(a.updatedAt) // descending
    //     })
    // }
	
	res.json({ products, page, pages: Math.ceil(count/pageSize) })
})

//  @desc   Fetch single product
//  @route  GET /api/products/:id
//  @access Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    
    if (product) {
        res.json(product)
    } else {
        // res.status(404).json({ message: 'Product not found' })
        res.status(404)
        throw new Error('Product not found')
    }
})

//  @desc   Delete a product
//  @route  DELETE /api/products/:id
//  @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    
    if (product) {
        await product.remove()
        res.json({ message: 'Product removed' })
    } else {
        // res.status(404).json({ message: 'Product not found' })
        res.status(404)
        throw new Error('Product not found')
    }
})

//  @desc   Create a product
//  @route  POST /api/products
//  @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        user: req.user._id,
        name: 'Sample name',
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        description: 'Sample description',
        //reviews: [reviewSchema],
        //rating: ,
        numReviews: 0,
        price: 0,
        countInStock: 0
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

//  @desc   Update a product
//  @route  PUT /api/products/:id
//  @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        image,
        brand,
        category,
        description,
        price,
        countInStock
    } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {

        product.name = name
        product.image = image
        product.brand = brand
        product.category = category
        product.description = description
        product.price = price
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

//  @desc   Create new review
//  @route  POST /api/products/:id/reviews
//  @access Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {

        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        console.log(product.reviews.length)
        product.reviews.push(review)
        console.log(product.reviews.length)

        product.numReviews = product.reviews.length

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await product.save()
        res.status(201).json({ message: 'Review added' })

    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

//  @desc   Get top rated products
//  @route  GET /api/products/top
//  @access Public
const getTopProducts = asyncHandler(async (req, res) => {

    const products = await Product.find({}).sort({ rating: -1 }).limit(3)
    // Passing -1 to get products in order to rating with ascending order
    
    res.json(products)
})

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts }