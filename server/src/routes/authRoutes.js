import express from 'express'
import { registerNewUser, signinUser } from '../controllers/authController.js';

const authRouter = express.Router();

// ====================================================================================================
// AUTH ROUTES
// ====================================================================================================

// POST: Register a User
authRouter.post('/register', registerNewUser);

// POST: Signin a User
authRouter.post('/signin', signinUser);

export default authRouter;