import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0, // Prevent negative price
        },

        stock: {
            type: Number,
            required: true,
            min: 0, // Prevent negative stock
            default: 0,
        },

        image: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;