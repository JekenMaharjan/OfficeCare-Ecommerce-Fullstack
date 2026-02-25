import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;


// ====================================================================================================
// AUTH CONTROLLER
// ====================================================================================================
// POST: Register new user
// POST: Login user
// ====================================================================================================


// ============================================================================
// POST: Register new user
// ============================================================================
export const registerNewUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1️. Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required.",
            });
        }

        // 2️. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists.",
            });
        }

        // 3️. Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4️. Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
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

        // 1️. Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        // 2️. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password.",
            });
        }

        // 3️. Compare passwords
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({
                message: "Invalid email or password.",
            });
        }

        // 4️. Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 5️. Send cookie (secure in production)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none", // important for frontend + backend on different domains
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            token,
            message: "Logged in successfully.",
            user: {
                id: user._id,
                name: user.name,
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