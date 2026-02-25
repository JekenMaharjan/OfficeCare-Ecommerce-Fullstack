import mongoose from "mongoose";
import Order from "../models/order.js";
import Cart from "../models/cart.js";


// ====================================================================================================
// ORDER CONTROLLER
// ====================================================================================================
// GET: Get all orders
// POST: Create order
// PATCH: Partially update orders' status
// ====================================================================================================


// ====================================================================================================
// GET: Get all orders
// ====================================================================================================
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("products.product", "name price")
            .sort({ createdAt: -1 }) // newest first
            .lean(); // use lean() for better performance

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ====================================================================================================
// POST: Create order
// ====================================================================================================
export const createOrder = async (req, res) => {
    try {
        const { fullName, phone, shippingAddress } = req.body;

        if (!fullName || !phone || !shippingAddress) {
            return res.status(400).json({ message: "All shipping details are required" });
        }

        console.log("USER ID:", req.user._id);
        const cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        console.log("CART FOUND:", cart);

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const totalAmount = cart.items.reduce(
            (acc, item) =>
                acc + item.product.price * item.quantity,
            0
        );

        for (let item of cart.items) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${item.product.name}`
                });
            }
        }

        const order = await Order.create({
            user: req.user._id,
            fullName,
            phone,
            shippingAddress,
            products: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            totalAmount,
            status: "Pending"
        });

        for (let item of cart.items) {
            item.product.stock -= item.quantity;
            await item.product.save();
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ====================================================================================================
// PATCH: Partially update orders' status
// ====================================================================================================
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status exists
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        // Allowed statuses
        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: "after" }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


