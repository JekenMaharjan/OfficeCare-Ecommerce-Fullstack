import express from "express";
import connect from "./db/connect.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import seedAdmin from "./seedAdmin.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

// ================================================================================

// Connect to DB and start server
const startServer = async () => {
    try {
        await connect();
        console.log("DB Connected");
        await seedAdmin();
        
        // Start server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();

// ================================================================================

const allowedOrigins = process.env.CLIENT_URL;

// Middleware
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());
app.use(cookieParser());

// ================================================================================

// Serve uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ================================================================================

// Routes with proper paths
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

// ================================================================================

// Root test route
app.get("/", (req, res) => {
    console.log("Hello World!!");
    res.send("Server is working!");
});

