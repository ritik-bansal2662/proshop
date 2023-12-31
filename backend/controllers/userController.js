import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  public
const authUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body
    // console.log('data: ',req.body);
    
    const user = await User.findOne({ email })
    // console.log('user', user);

    if(user && await user.matchPassword(password)) {
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid Email or Password')
    }
})


// @desc    Register a new user
// @route   POST /api/users/
// @access  public
const registerUser = asyncHandler( async (req, res) => {
    const { email, password, name } = req.body
    
    const userExists = await User.findOne({ email })

    if(userExists) {
        res.status(400)
        throw new Error('User Already Exists')
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user) {
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('nvalid User Data')
    }
})


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  private
const getUserProfile = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(404)
        throw new Error('User not found.')
    }
})


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  private
const updateUserProfile = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id)
    console.log('data: ',req.body);
    console.log('user: ',user);
    if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if(req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()
        res.json({
            _id : updatedUser._id,
            name : updatedUser.name,
            email : updatedUser.email,
            isAdmin : updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        })
    } else {
        res.status(404)
        throw new Error('User not found.')
    }
})


// @desc    Get all users
// @route   GET /api/users
// @access  private/Admin
const getUsers = asyncHandler( async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

// @desc    Delete User
// @route   DELETE /api/users/:id
// @access  private/Admin
const deleteUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id)

    if(user) {
        await user.deleteOne()
        res.json({ message: 'User removed.'})
    } else {
        res.status(404)
        throw new Error('User Not found.')
    }
})

// @desc    Get a user
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if(user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found.')
    }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id)
    // console.log('data: ',req.body);
    if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin 

        const updatedUser = await user.save()
        res.json({
            _id : updatedUser._id,
            name : updatedUser.name,
            email : updatedUser.email,
            isAdmin : updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found.')
    }
})


export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}
