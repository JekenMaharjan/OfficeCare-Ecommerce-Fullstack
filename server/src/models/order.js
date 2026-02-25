import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        fullName: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],

        totalAmount: {
            type: Number,
            required: true,
        },

        shippingAddress: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Processing", "Delivered", "Cancelled"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;