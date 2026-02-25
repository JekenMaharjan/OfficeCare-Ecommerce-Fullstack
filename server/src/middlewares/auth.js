import jwt from "jsonwebtoken";
import User from "../models/user.js";


// ====================================================================================================
// MIDDLEWARES AUTH
// ====================================================================================================
// Auth Middleware
// Admin Middleware
// Authorize User
// ====================================================================================================


// ====================================================================================================
// Auth Middleware
// ====================================================================================================
export const authMiddleware = async (req, res, next) => {
    try {
        // Check token from cookies OR Authorization header
        const token =
            req.cookies?.token ||
            req.headers.authorization?.split(" ")[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // attach user to request
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};


// ====================================================================================================
// Admin Middleware
// ====================================================================================================
export const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
};


// ====================================================================================================
// Authorize User
// ====================================================================================================
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};