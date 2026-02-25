import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,        // prevents duplicate emails
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["admin", "customer"],
            default: "customer",
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;