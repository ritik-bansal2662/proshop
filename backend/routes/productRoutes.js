import express  from "express";
const router = express.Router()
import { getProducts, getProductById } from "../controllers/productController.js";


// @desc    Fetch all products
// @route   GET /api/products
// @access  public
router.route('/').get(getProducts)

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  public
router.route('/:id').get(getProductById)





export default router

