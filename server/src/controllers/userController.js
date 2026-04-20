import User from "../models/user.js";

// ====================================================================================================
// USER CONTROLLER
// ====================================================================================================
// GET: Get all users (Admin only)
// ====================================================================================================

// ====================================================================================================
// GET: Get all users (Admin only)
// ====================================================================================================
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .lean();

        res.status(200).json({
            count: users.length,
            users
        });

    } catch (error) {
        console.error("GetAllUsers error:", error);
        res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};

