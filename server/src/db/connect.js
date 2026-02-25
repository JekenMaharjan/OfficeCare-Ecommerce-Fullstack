import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const API = process.env.MONGO_URI;

const connect = async () => {
    try {
        const conn = await mongoose.connect(API);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Stop the server if DB fails
    }
};

export default connect;