import express from 'express'
const router = express.Router()
import {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
} from '../controllers/userController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

router
    .route('/').post(registerUser)
    .get(protect, admin, getUsers)
router.post('/login', authUser)  // This is going to be hook to /api/users
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)  // This is going to be hook to /api/users and router.route is used because we will be making a get request and a put request to update the user profile. protect is a middleware
router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)

export default router