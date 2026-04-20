import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.js";
import { getAllUsers } from "../controllers/userController.js";

const userRouter = express.Router();

// ====================================================================================================
// USER ROUTES
// ====================================================================================================

// Protect all user routes (User must be logged in)
userRouter.use(authMiddleware);

// ====================================================================================================

// GET: Authenticated user profile (admin & customer both allowed)
userRouter.get("/profile", (req, res) => {
    res.json({
        message: "Profile data",
        user: req.user
    });
});

// ====================================================================================================

// GET: Admin only - get all users
userRouter.get("/all-users", authorize("admin"), getAllUsers);

export default userRouter;