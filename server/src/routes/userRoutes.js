import express from 'express'
import { adminMiddleware, authMiddleware, authorize } from '../middlewares/auth.js';
import { getAllUsers } from '../controllers/userController.js';

const userRouter = express.Router();

// ====================================================================================================
// USER ROUTES
// ====================================================================================================

// Protect all order routes
userRouter.use(authMiddleware);
// userRouter.use(adminMiddleware);

// ====================================================================================================

// GET: Route for authenticated users
userRouter.get("/profile", authorize("admin"), (req, res) => {
    res.json({ message: "Profile data", user: req.user });
});

// GET: Route for admin only
userRouter.get("/all-users", authorize("admin"), getAllUsers);

export default userRouter;