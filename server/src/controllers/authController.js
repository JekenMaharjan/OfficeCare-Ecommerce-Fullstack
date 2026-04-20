import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

// ============================================================================
// AUTH CONTROLLER
// ============================================================================
// POST: Register new user
// POST: Login user
// ============================================================================

// ============================================================================
// POST: Register new user
// ============================================================================
export const registerNewUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Basic validation
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required.",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role,
            },
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "Registration failed. Please try again later.",
        });
    }
};

// ============================================================================
// POST: Login user
// ============================================================================
export const signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password.",
            });
        }

        // Check password
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({
                message: "Invalid email or password.",
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", // better default than "none" for most cases
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Logged in successfully.",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
            isLoggedIn: true,
        });

    } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({
            message: "Signin failed. Please try again later.",
        });
    }
};