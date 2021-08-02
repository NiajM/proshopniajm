import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

//  @desc   Auth user & get token
//  @route  POST /api/users/login
//  @access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body    // It will give us the data that sent in the body. And for that we do have to just add a one piece of middleware in our server.js file in order to for that request body to actually pass

    const user = await User.findOne({ email })   // ({ email: email })
    
    if (user && (await user.matchPassword(password))) {
         res.json({
             _id: user._id,
             name: user.name,
             email: user.email,
             isAdmin: user.isAdmin,
             token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

//  @desc   Register a new user
//  @route  POST /api/users
//  @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })   // ({ email: email })

    if (userExists) {
        res.status(400) // Because it's a bad request
        throw new Error('This Email/User already exists')
    }

    const user = await User.create({    // create is basicaly syntactic sugar for the save method 
        name,
        email,
        password
    })

    if (user) {
        res.status(201).json({  // 201 means something was created
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400) // Because it's a bad request
        throw new Error('Invalid user data')
    }
})

//  @desc   GET user profile
//  @route  GET /api/users/profile
//  @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)  // req.user have all data from database except password by authMiddleware.js

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

//  @desc   Update user profile
//  @route  PUT /api/users/profile
//  @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)  // This user gets all data from database // req.user have all data from database except password by authMiddleware.js
    
    if (user) { // req.body is posting the data from current page/url
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password   // It will be encrypted automatically even if the passwords change because of what we did in the model-> userModel.js
        }

        const updatedUser = await user.save()
        
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })

    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

//  @desc   GET all users
//  @route  GET /api/users
//  @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})  // giving empty object to find all users

    res.json(users)
})

//  @desc   Delete user
//  @route  DELETE /api/users/:id
//  @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)  // taking id from requested url parameter and getting the user by this Id

    if (user) {
        await user.remove()
        res.json({ message: 'User Removed' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

//  @desc   GET user by ID
//  @route  GET /api/users/:id
//  @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')

    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

//  @desc   Update user
//  @route  PUT /api/users/:id
//  @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.params.id)
    
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        
        if (req.body.isAdmin === true || req.body.isAdmin === false) {
            user.isAdmin = req.body.isAdmin
        }

        const updatedUser = await user.save()
        
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser }