import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'


// @desc    Fetch all products
// @route   GET /api/products
// @access  public
const getProducts = asyncHandler( async (req, res) => {
    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}
    const skipDocs = pageSize * (page-1)
    const count = await Product.countDocuments({ ...keyword })
    const countLimit = await Product.countDocuments({ ...keyword }).limit(pageSize).skip(pageSize * page-1)
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(skipDocs)

    // console.log('products: ', products);
    // console.log('count: ', count);
    // console.log('countLimit: ', countLimit);
    // console.log('pageSize: ', pageSize);
    // console.log('skipDocs: ', skipDocs);
    // console.log('page: ', page);
    
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
})


// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  public
const getProductById = asyncHandler( async (req, res) => {
    const product = await Product.findById( req.params.id )

    if(product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not Found')

    }
})

// @desc    Delete single product
// @route   DELETE /api/products/:id
// @access  public/Admin
const deleteProduct = asyncHandler( async (req, res) => {
    // console.log('delete product api called');
    // console.log(req.params.id);
    const product = await Product.findById(req.params.id )

    if(product) {
        await product.deleteOne()
        res.json({ message: 'Product Removed.'})
    } else {
        res.status(404)
        throw new Error('Product not Found')

    }
})

// @desc    Create a product
// @route   POST /api/products
// @access  public/Admin
const createProduct = asyncHandler( async (req, res) => {
    const product = new Product({
        name: "Sample Name",
        price: 0,
        user: req.user._id,
        image: "/images/sample.jpg",
        brand: "sample brand",
        category: "sample category",
        countInStock: 0,
        numReviews: 0,
        description: "sample description"
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  private/Admin
const updateProduct = asyncHandler( async (req, res) => {
    const {
        name,
        brand,
        price,
        description,
        image,
        category,
        countInStock,
    } = req.body

    // console.log('req.body: ', req.body);

    const product = await Product.findById(req.params.id)

    // console.log('product: ', product);

    if(product) {
        product.name = name
        product.price = price
        product.brand = brand
        product.description = description
        product.image = image
        product.category = category
        product.countInStock = countInStock 

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not Found.')
    }

})

// @desc    Create new Review
// @route   POST /api/products/:id/review
// @access  private
const createProductReview = asyncHandler( async (req, res) => {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if(product) {
        const alreadyReviwed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

        if(alreadyReviwed) {
            res.status(400)
            throw new Error('Product already Reviewed.')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await product.save()
        res.status(201).json({ message: 'Review added.' })
    } else {
        res.status(404)
        throw new Error('Product not Found.')
    }

})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler( async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)

    res.json(products)
})

export {
    getProducts, 
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts
}

