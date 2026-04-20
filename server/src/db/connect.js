import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connect = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const conn = await mongoose.connect(MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Stop server if DB fails
    }
};

export default connect;