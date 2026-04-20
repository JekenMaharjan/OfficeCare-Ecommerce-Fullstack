import mongoose from "mongoose";
import Order from "../models/order.js";
import Cart from "../models/cart.js";

// ====================================================================================================
// ORDER CONTROLLER
// ====================================================================================================
// GET: Get all orders (Admin)
// POST: Create order
// PATCH: Update order status (Admin)
// ====================================================================================================

// ====================================================================================================
// GET: Get all orders (Admin)
// ====================================================================================================
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "fullName email")
            .populate("products.product", "name price")
            .sort({ createdAt: -1 })
            .lean();

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
            return res.status(400).json({
                message: "All shipping details are required"
            });
        }

        const cart = await Cart.findOne({ user: req.user.id })
            .populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Stock validation
        for (const item of cart.items) {
            if (!item.product) {
                return res.status(400).json({
                    message: "Product not found"
                });
            }

            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${item.product.name}`
                });
            }
        }

        // Calculate total
        const totalAmount = cart.items.reduce((acc, item) => {
            return acc + item.product.price * item.quantity;
        }, 0);

        // Create order
        const order = await Order.create({
            user: req.user.id,
            fullName: fullName.trim(),
            phone: phone.trim(),
            shippingAddress: shippingAddress.trim(),
            products: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            totalAmount,
            status: "Pending"
        });

        // Reduce stock (ONLY HERE — correct place)
        for (const item of cart.items) {
            await Order.updateOne(
                { _id: order._id },
                {} // no-op (just keeping structure clean)
            );

            await item.product.updateOne({
                $inc: { stock: -item.quantity }
            });
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json(order);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

// ====================================================================================================
// PATCH: Update order status (Admin)
// ====================================================================================================
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};