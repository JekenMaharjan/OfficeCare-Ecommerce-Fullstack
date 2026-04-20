import jwt from "jsonwebtoken";
import User from "../models/user.js";

// ====================================================================================================
// MIDDLEWARES AUTH
// ====================================================================================================
// Auth Middleware
// Admin Middleware
// Role Based Authorization
// ====================================================================================================

// ====================================================================================================
// Auth Middleware
// ====================================================================================================
export const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Get token from cookies
        if (req.cookies?.token) {
            token = req.cookies.token;
        }

        // Get token from Authorization header
        if (!token && req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If no token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Attach user
        req.user = user;

        next();
    } catch (error) {
        console.error("Auth error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token"
        });
    }
};

// ====================================================================================================
// Admin Middleware
// ====================================================================================================
export const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admins only"
        });
    }

    next();
};

// ====================================================================================================
// Role Based Authorization
// ====================================================================================================
export const authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        next();
    };
};


