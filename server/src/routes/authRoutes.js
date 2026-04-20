import express from 'express';
import {
    registerNewUser,
    signinUser,
} from '../controllers/authController.js';
// import {
//     registerNewUser,
//     signinUser,
//     logoutUser,
//     getCurrentUser
// } from '../controllers/authController.js';

import { authMiddleware } from '../middlewares/auth.js';

const authRouter = express.Router();

// ====================================================================================================
// AUTH ROUTES
// ====================================================================================================

// Register User
authRouter.post('/register', registerNewUser);

// Login User
authRouter.post('/signin', signinUser);

// // Logout User
// authRouter.post('/logout', logoutUser);

// // Get Current Logged in User
// authRouter.get('/me', authMiddleware, getCurrentUser);

export default authRouter;